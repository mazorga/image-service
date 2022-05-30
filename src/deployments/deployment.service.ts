import {  Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Deployment } from "./deployment.model";
import { Image } from '../images/image.model'
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import * as mongoose from 'mongoose'
import { DeploymentQueueStatus } from "./enums/deployment.queue.status";
import { DeploymentStatus } from "./enums/deployment.status";
import { promises as fs } from 'fs';
import { DeploymentQueue} from "./deployment.queue.model";

@Injectable()
export class DeploymentService{

    constructor(@InjectModel ('Deployment')private  readonly deploymentModel:Model<Deployment>,
                @InjectModel('DeploymentQueue')private  readonly deploymentQueueModel:Model<DeploymentQueue>,
                @InjectModel('Image')private  readonly imageModel:Model<Image>){}

    readonly DEPLOYMENT_QUEUE_NAME = 'deploymentQueue'; 
    readonly LOCAL_COUNT_PATH = '/tmp/count.txt';

    async createDeployment(imageId: string): Promise<{deploymentId: string,status: string}>
    {
        let exists = await this.imageModel.exists({'_id' : imageId }).exec();
        if(!exists)
        {
            throw new NotFoundException("Your resource cannot be found")
        }
        //if we think that writing to file is a heavy operation the pending operation should be done in one of the other machines in order to balance load
        const imageIdObjectId =  new mongoose.Types.ObjectId(imageId);
        const newDeployment = new this.deploymentModel({
            imageId: imageIdObjectId, DeploymentStatus : DeploymentStatus.INIT});
        let newDeploymentResult;
        let created: boolean;
        try
        {
            newDeploymentResult = await newDeployment.save();
            let currentDeploymentId:string = newDeploymentResult['_id'];
            let deploymentQueueModelFilter = {name : this.DEPLOYMENT_QUEUE_NAME};
            let pushDeploymentToQueueUpdate =  { $push: { pendingDeployments: currentDeploymentId } };
            await this.createLockIfNotExists();
            //pushing to queue
            await this.deploymentQueueModel.findOneAndUpdate(deploymentQueueModelFilter, pushDeploymentToQueueUpdate);
            
            //trying to fetch from queue
            let queueIsReady = {status: DeploymentQueueStatus.FREE};
            let queueIsBusyAndPop = {status: DeploymentQueueStatus.IN_DEPLOYMENT,  $pop: { pendingDeployments: 1 }};
            let currentDeploymentToProcess
            
            do
            {
                //trying to accuire the lock
                let deploymentsQueue = await this.deploymentQueueModel.findOneAndUpdate(deploymentQueueModelFilter, queueIsBusyAndPop).exec();
                if(deploymentsQueue)
                {
                    currentDeploymentToProcess = deploymentsQueue['pendingDeployments'].pop();
                    if(currentDeploymentToProcess)
                    {
                        if(currentDeploymentToProcess == currentDeploymentId)
                        {
                            created = true;
                        }
                        let numOfItems = (await this.count()).numberOfDoneDeployments + 1;
                        //The processing step might be redundant
                        await this.deploymentModel.findOneAndUpdate({_id: currentDeploymentToProcess}, {status: DeploymentStatus.PROCESSING}).exec();
                        await fs.writeFile(this.LOCAL_COUNT_PATH, numOfItems.toString() ,'utf8')
                        await this.deploymentModel.findOneAndUpdate({_id: currentDeploymentToProcess}, {status: DeploymentStatus.DONE}).exec();
                    }
                    await this.deploymentQueueModel.findOneAndUpdate(deploymentQueueModelFilter, queueIsReady).exec();
                }
            }
            while(currentDeploymentToProcess)

        }catch(err)
        {
            console.log(err);
            throw new InternalServerErrorException(err);
        }
        // return result.id as string;
        let status:string = created ? 'CREATED' : 'PENDING';
        return {deploymentId: newDeploymentResult['_id'],status: status};
    }

    async getDeployments(pageSize: number, lastItem: string):Promise<Deployment[]>
    {
        let query;
        try
        {
            if(lastItem) 
            {
                query = this.deploymentModel.find({_id:{ $gt: new mongoose.Types.ObjectId(lastItem)}});
            }
            else
            {
                query = this.deploymentModel.find({});
            }
            const result =  await query.limit(pageSize).sort('_id').exec();
            return result as Deployment[];
        }catch(err)
        {
            throw new InternalServerErrorException(err);
        }
    }

    async createLockIfNotExists()
    {
        let filterAndUpdate = {name: 'deploymentQueue'};//created by defualt with status : FREE
        let res = await this.deploymentQueueModel.findOneAndUpdate(filterAndUpdate, filterAndUpdate, {upsert: true}).exec();
        console.log(res);
    }

    async count(): Promise<{'numberOfDoneDeployments':number}>
    {
        let numberOfDoneDeployments = await this.deploymentModel.count({status: DeploymentStatus.DONE}).exec();
        return {'numberOfDoneDeployments' : numberOfDoneDeployments};
    }
}
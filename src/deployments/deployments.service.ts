import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Deployment } from "./deployment.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import * as mongoose from 'mongoose'
import { promises as fs } from 'fs';

@Injectable()
export class DeploymentService{

    constructor(@InjectModel ('Deployment')private  readonly deploymentModel:Model<Deployment>){}

    //todo add return type
    async createDeployment(imageId: string)
    {
        const imageIdObjectId =  new mongoose.Types.ObjectId(imageId)
        const newDeployment = new this.deploymentModel({
            imageId: imageIdObjectId});
        
        let result;
        try
        {
             result = await newDeployment.save();
             let numOfItems:number = await this.deploymentModel.count();
             fs.writeFile('count.txt', numOfItems.toString() ,'utf8')

        }catch(err)
        {
            if(err.code == '11000')
            {
                throw new InternalServerErrorException('Duplicate Key Exception')
            }else
            {
                console.log(err);
                throw new InternalServerErrorException();
            }
        }
        return result.id as string;


   

    }

    async getDeployments(pageSize: number, lastItem: string)
    {
        let query;
        if(lastItem) 
        {
            query=  this.deploymentModel.find({_id:{ $gt: new mongoose.Types.ObjectId(lastItem)}})
        }
        else
        {
            query = this.deploymentModel.find();
        }
        const result =  await query.limit(pageSize).sort('_id').exec();
        console.log(result);
        return result as Deployment[];
    }

    async count()
    {
        return this.deploymentModel.count();
    }

    
    // async todelete(reqModel: CreateImageModel)
    // {
         //     let query;
    //      let session = null;
    //      this.deploymentModel.startSession().
        
    //      // The `withTransaction()` function's first parameter is a function
    //      // that returns a promise.
    //      then(_session => {
    //      session = _session;
    //      return session.withTransaction(() => {
    //      return this.deploymentModel.create([{ imageId: imageIdObjectId }], { session: session });
    //    }) ;
    //      }).
    //      then(() => this.deploymentModel.countDocuments()).
    //      then(count => console.log(count)).
    //      then(() => session.endSession());
    // }


}
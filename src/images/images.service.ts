import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Image } from "./image.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import * as mongoose from 'mongoose'
import { CombinationHelper } from "src/helpers/combinations.helper";
import { CreateImageModel } from "./create.image.model";

@Injectable()
export class ImagesService{

    constructor(@InjectModel ('Image')private  readonly imageModel:Model<Image>,
                private   combinationsHelper: CombinationHelper){}

    async createImage(createImageModel: CreateImageModel):Promise<{id:string}>
    {
        // I'm not sure why the below code didn't work with dot notation https://stackoverflow.com/questions/50947772/updating-the-path-x-would-create-a-conflict-at-x
        // all the below code should be done in 1 query

        const newImage = new this.imageModel({
            name: createImageModel.imageName,
            repository: createImageModel.repository,
            version: createImageModel.version ,
            metadata: createImageModel.metadata})

        let result;
        let currDocId;
        try
        {
              result = await newImage.save();
              currDocId = result['_id'];
        }
        catch(err)
        {
            //upsert logic
            if(err.code == '11000')
            {
                const filter = { name: createImageModel.imageName };
                const doc = await this.imageModel.findOne(filter,'metadata')
                const mergedMetadata = {...doc['metadata'], ...createImageModel.metadata}; 
                console.log(newImage)
                const update = {metadata : mergedMetadata, version: createImageModel.version, repository : createImageModel.repository};   
                await this.imageModel.findOneAndUpdate(filter, update).exec();
                console.log(JSON.stringify(doc));
                currDocId = doc['_id'];
            }
            else
            {
                throw new InternalServerErrorException(err);
            }
        }
        return {id:currDocId};
    }

    async getImageById(id: string) :Promise<Image>
    {
        let currImage: Image;
        try
        {
            currImage = await this.imageModel.findById(id).exec();
        } 
        catch(error)
        {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        if(!currImage)
        {
            throw new NotFoundException()
        }
         return currImage as Image;
    }

    //https://stackoverflow.com/questions/5125521/uses-for-mongodb-objectid-creation-time
    // mongo id can order by creation day
    //todo this code is duplication with getDeployments code ...
    async getImages(pageSize: number, lastItem: string) :Promise<Image[]>
    {
        let query;
        if(lastItem) 
        {

            query =  this.imageModel.find({_id:{ $gt: new mongoose.Types.ObjectId(lastItem)}})
        } 
        else
        {
            query = this.imageModel.find();
        }
        try
        {
        const result =  await query.limit(pageSize).sort({'_id':-1}).exec();
        return result as Image[];
        }catch(err)
        {
            throw new InternalServerErrorException(err);
        }
    }

    //todo add cache layer
   async getAllPermutaions(permutaionSize: number): Promise<string[]>
   {
    const result = await this.imageModel.aggregate( [
        { $sort: { date: 1, item: 1 } },
        {
            $group:
              {
                _id: '',
                imageNames: { $push:   "$name" }
              },    
          },
        ]).exec();

        const allNames: string[] = result[0]['imageNames']
        let data = new Array(permutaionSize);
        data.fill(0);

       let listOfLists = [];
       
        this.combinationsHelper.getCombinations(allNames,allNames.length,permutaionSize,0,data,0,listOfLists);
        return listOfLists;
   }


   //todo - a better merge should be done with don notatin
   //todo - move to helper
    dotNotate(obj:object,target:object,prefix:string) {
        target = target || {},
        prefix = prefix || "";
    

        for (let key in obj)
        {
            if(typeof(obj[key]) === 'object' && obj[key] !== null)
            {
                this.dotNotate(obj[key],target,prefix + key + ".");
            } else 
            {
                return target[prefix + key] = obj[key]; 
            }
        } 
        return target;
        };
}
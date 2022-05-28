import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Image } from "./image.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { time } from "console";
import internal from "stream";
import { filter } from "rxjs";
import * as mongoose from 'mongoose'
import { CreateImageModel } from "./create.image.model";

@Injectable()
export class ImagesService{

    constructor(@InjectModel ('Image')private  readonly imageModel:Model<Image>){}

    async createImage(createImageModel: CreateImageModel)
    {
        const newImage = new this.imageModel({
            name: createImageModel.imageName,
            repository: createImageModel.repository,
            version: createImageModel.version ,
            metadata: createImageModel.metadata})

        let result;
        try{
            let query = {'name': createImageModel.imageName};

            console.log(createImageModel.imageName)
            const filter = { name: createImageModel.imageName };
            const update = { 
                version :  createImageModel.version,
                repository: createImageModel.repository,
                metadata: createImageModel.metadata};
            
            // `doc` is the document _after_ `update` was applied because of
            // `returnOriginal: false`
            let doc = await this.imageModel.findOneAndUpdate(filter, update, { upsert:true,
             returnOriginal: true
            });
            doc.name; // 'Jean-Luc Picard'
            doc.version; // 59
            console.log(doc);
            // result = await this.imageModel.findOneAndUpdate(query, newImage, {upsert: true}).exec();
            //  result = await newImage.save();
        }catch(err)
        {
            console.log(err)
            if(err.code == '11000')
            {
                throw new InternalServerErrorException('Duplocate Key Exception')
            }else
            {
                throw new InternalServerErrorException();
            }
        }
        
        return 'some id';
        // return result.id as string;
    }

    async updateImage(imageId: string,newImage: Image)
    {
        let query = {'_id': imageId};

        try
        {
        await this.imageModel.findOneAndUpdate(query, newImage, {upsert: true}).exec();
        }
        catch(err)
        {
            console.log(err);
            throw new InternalServerErrorException("Something went wrong")
        }
    }

    async getImageById(id: string)
    {
        let currImage: Image;
        try
        {
            currImage = await this.imageModel.findById(id).exec();
        } 
        catch(error)
        {
            console.log(error);
            throw new BadRequestException();
        }
        if(!currImage)
        {
            throw new NotFoundException()
        }
         return currImage as Image;
    }

    async getImages(pageSize: number, lastItem: string)
    {
        let query;
        if(lastItem) {

            query=  this.imageModel.find({_id:{ $gt: new mongoose.Types.ObjectId(lastItem)}})
        } else
        {
            query = this.imageModel.find();
        }
        const result =  await query.limit(pageSize).sort('_id').exec();
        console.log(result);
        return result as Image[];
    }


   async getAllPermutaions(permutaionSize: number)
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
        //   { $addFields:
        //     {
        //       sets:
        //           { $function:
        //              {
        //                 body: function(imageNames: string[]) {

        //                     const numOfItems: number = imageNames.length
        //                     let set: [string[]] ;
        //                     const permSize=2;
        //                     for (let i=0; i<numOfItems; i++)
        //                     {
        //                         set.push()
        //                         for(let j=i+1; j<numOfItems;j++)
        //                         {

        //                         }
        //                     }
        //                    return imageNames[0];
        //                 },
        //                 args: [ "$imageNames" ],
        //                 lang: "js"
        //              }
        //           }
        //      }
        //   }
        ]).exec();
        const allNames: string[] = result[0]['imageNames']
        let k = 2;
        let data = new Array(k);
        data.fill(0);

       let listOfLists = []
        this.combinationUtil(allNames,allNames.length,2,0,data,0,listOfLists)
        console.log(listOfLists)
   }



combinationUtil(arr, n, r, index, data, i,listOfLists)
{
    // Current combination is ready to
    // be printed, print it
    if (index == r)
    {
        let currList = []
        for (let j = 0; j < r; j++)
        {
            currList.push(data[j])
        }     
        listOfLists.push(currList)
        return;
    }

    // When no more elements are there
    // to put in data[]
    if (i >= n)
        return;

    // current is included, put next
    // at next location
    data[index] = arr[i];
    this.combinationUtil(arr, n, r, index + 1,
                            data, i + 1,listOfLists);

    // current is excluded, replace
    // it with next (Note that i+1
    // is passed, but index is not
    // changed)
    this.combinationUtil(arr, n, r, index,
                            data, i + 1,listOfLists);
}

}
import { Controller, Get, Post ,Body, Param, Query} from "@nestjs/common";
import { ObjectId } from "mongoose";
import { threadId } from "worker_threads";
import { CreateImageModel } from "./create.image.model";
import { Image } from "./image.model";
import { ApiBody, ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import { ImagesService } from "./images.service";
import { ImageQueryModel } from "./Image.query.model";

@Controller('api/v1/')
export class ImagesController{

    constructor(private readonly imagesService: ImagesService){}
    
    
    @Get('images/:id')
    async  getImageById(@Param('id') imageId: string):Promise <Image>{
        
        return await this.imagesService.getImageById(imageId);
    }

    @Get('images')
    async  getImages(
    @Query() imageQuery: ImageQueryModel){
        
         return await this.imagesService.getImages(imageQuery.pageSize,imageQuery.lastItem);
    }
    // todo check why swagger doesn't infer request model
    // 
    @Post('images')
    @ApiBody({ type: CreateImageModel })
    async createImage(@Body() createImageModel : CreateImageModel) : Promise<string>{
        return await this.imagesService.createImage(createImageModel);
    }

    //todo change return type 
    ///api/v1/images/permutations
    @Get('images_permutations')
    async  getPermutaions(){
        
         await this.imagesService.getAllPermutaions(2);
    }
}
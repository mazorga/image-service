import { Controller, Get, Post ,Body, Param, Query, BadRequestException} from "@nestjs/common";
import { CreateImageModel } from "./create.image.model";
import { Image } from "./image.model";
import { ApiBody, ApiParam, ApiProperty, ApiQuery, ApiTags} from "@nestjs/swagger";
import { ImagesService } from "./images.service";
import { ObjectIdParam } from "../base.models/objectid.param";
import { BasePaginationQueryModel } from "src/base.models/base.pagination.query.model";
import { InputValidator } from "src/validators/InputValidator";

@ApiTags('images')
@Controller('api/v1/')
export class ImagesController{

    constructor(private readonly imagesService: ImagesService,private readonly inputValidator:InputValidator){};
    
    @Get('images/:id')
    @ApiParam({name: 'imageId',description: 'image id of that we want to deploy'})
    async  getImageById(@Param() params: ObjectIdParam):Promise <Image>
    {
        return await this.imagesService.getImageById(params.id);
    }

    @Get('images')
    async  getImages(
    @Query() imageQuery: BasePaginationQueryModel){
         this.inputValidator.validateNumberInput(imageQuery.pageSize,1,120);
         return await this.imagesService.getImages(imageQuery.pageSize,imageQuery.lastItem);
    }

    @Post('images')
    @ApiBody({ type: CreateImageModel })
        async createImage(@Body() createImageModel : CreateImageModel) : Promise<{id:string}>
    {
        return await this.imagesService.createImage(createImageModel);
    }
    //probably should be moved to another class...
    @Get('images_permutations')
    @ApiQuery({ name: 'length'  })
    async  getPermutaions(@Query('length') length ) :Promise<string[]>
    {
        this.inputValidator.validateNumberInput(length.pageSize,1,120);
         return await this.imagesService.getAllPermutaions(length);
    }
}
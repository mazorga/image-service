import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller'
import { ImagesService } from './images.service';
import { ImageSchema } from './image.schema'
import { MongooseModule } from '@nestjs/mongoose';
import { CombinationHelper } from 'src/helpers/combinations.helper';
import { InputValidator } from 'src/validators/InputValidator';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }])] ,
  controllers: [ImagesController ],
  providers: [ImagesService,CombinationHelper,InputValidator],
})
export class ImageModule {}
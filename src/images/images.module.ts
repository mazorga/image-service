import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller'
import { ImagesService } from './images.service';
import { ImageSchema } from './image.schema'
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }])] ,
  controllers: [ImagesController ],
  providers: [ImagesService],
})
export class ImageModule {}
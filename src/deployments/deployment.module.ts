import { Module } from '@nestjs/common';
import { DeploymnetSchema } from './deployment.schema'
import { MongooseModule } from '@nestjs/mongoose';
import { DeploymentsController } from './deployment.controller';
import { DeploymentService } from './deployment.service';
import { DeploymnetQueueSchema } from './deployment.queue.schema';
import { ImageSchema } from 'src/images/image.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),MongooseModule.forFeature([{ name: 'Deployment', schema: DeploymnetSchema }]),
  MongooseModule.forFeature([{ name: 'DeploymentQueue', schema: DeploymnetQueueSchema }])] ,
  controllers: [DeploymentsController ],
  providers: [DeploymentService],
})
export class DeploymentModule {}
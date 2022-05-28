import { Module } from '@nestjs/common';
import { DeploymnetSchema } from './deployments.schema'
import { MongooseModule } from '@nestjs/mongoose';
import { DeploymentsController } from './deployments.controller';
import { DeploymentService } from './deployments.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Deployment', schema: DeploymnetSchema }])] ,
  controllers: [DeploymentsController ],
  providers: [DeploymentService],
})
export class DeploymentModule {}
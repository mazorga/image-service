import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export type ImageDocument = Image & Document;
import * as mongoose from 'mongoose'
import { DeploymentQueueStatus } from './enums/deployment.queue.status';
import { DeploymentStatus } from './enums/deployment.status';

export const DeploymnetSchema = new mongoose.Schema( {

  imageId: {type: mongoose.Schema.Types.ObjectId , required: true, ref: "Image"},
  status: {
    type: String,
    enum: DeploymentStatus,
    default: DeploymentStatus.INIT,
}
}, {strictQuery: 'throw'} );
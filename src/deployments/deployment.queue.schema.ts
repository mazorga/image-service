import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export type ImageDocument = Image & Document;
import * as mongoose from 'mongoose'
import { DeploymentQueueStatus } from './enums/deployment.queue.status';

export const DeploymnetQueueSchema = new mongoose.Schema( {
  name: String,
  pendingDeployments: [String],
  status: {
    type: String,
    enum: DeploymentQueueStatus,
    default: DeploymentQueueStatus.FREE,
}
}, {strictQuery: 'throw'} );
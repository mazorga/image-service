import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export type ImageDocument = Image & Document;
import * as mongoose from 'mongoose'

export const DeploymnetSchema = new mongoose.Schema( {
  
  imageId: {type: mongoose.Schema.Types.ObjectId , required: true, ref: "Image"},
}, {strictQuery: 'throw'} );
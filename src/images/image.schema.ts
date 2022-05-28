
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export type ImageDocument = Image & Document;
import * as mongoose from 'mongoose'

export const ImageSchema = new mongoose.Schema( {
  
  name: {type:String, unique: true,required: true},
  repository: {type:String, unique: false,required: true},
  version: {type:String, unique: false,required: true},
  metadata: { type: Object, default: {} }
}, {strictQuery: 'throw'} );
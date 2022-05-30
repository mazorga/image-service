import { IsMongoId ,IsString} from 'class-validator';
import { Types } from 'mongoose'; 
import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
export class ObjectIdParam {
  
  @IsMongoId()
  @IsString()
  @Transform((value) => SafeMongoIdTransform(value))
  id: string;
}

export const SafeMongoIdTransform = ({ value }) => {
  try {
    if (
      Types.ObjectId.isValid(value) &&
      new Types.ObjectId(value).toString() === value
    ) {
      return value;
    }
    throw new BadRequestException('Id validation fail');
  } catch (error) {
    throw new BadRequestException('Id validation fail');
  }
};
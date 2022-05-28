import {ApiProperty,ApiPropertyOptional} from '@nestjs/swagger'

export class ImageQueryModel {
    @ApiProperty()
    pageSize: number;
    @ApiPropertyOptional()
    lastItem: string;
  }
import {ApiProperty,ApiPropertyOptional} from '@nestjs/swagger'
import { Min ,Max,IsNumber,IsMongoId ,ValidateIf} from 'class-validator';

export class BasePaginationQueryModel{
    
    @ApiProperty()
    //todo  check why the below doesn't work 
    // @IsNumber()
    // @Min(1)
    // @Max(120)
    pageSize: number;
    @ApiPropertyOptional()
    @ValidateIf(o => o.lastItem)
    @IsMongoId()
    lastItem: string;
}
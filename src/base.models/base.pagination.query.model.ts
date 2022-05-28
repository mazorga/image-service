import {ApiProperty,ApiPropertyOptional} from '@nestjs/swagger'

export class BasePaginationQueryModel{
    //todo add min / max here
    @ApiProperty()
    pageSize: number;
    @ApiPropertyOptional()
    lastItem: string;
}
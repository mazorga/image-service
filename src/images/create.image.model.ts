import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateImageModel{        
   
    @ApiProperty()
    @IsNotEmpty()
    public imageName: string;
    @IsNotEmpty()
    @ApiProperty()
    public repository: string;
    @IsNotEmpty()
    @ApiProperty()
    public version: string;
    @ApiProperty()
    public metadata : object;
}


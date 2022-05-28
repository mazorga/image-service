import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateDeploymentModel{        
   
    @ApiProperty()
    @IsNotEmpty()
    private _imageId: string;


    get imageId() :string
    {
        return this._imageId;
    }
    set imageId (imageId: string){
        this._imageId = imageId;
    }

}
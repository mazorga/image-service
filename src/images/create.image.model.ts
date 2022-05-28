import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateImageModel{        
   
    @ApiProperty()
    @IsNotEmpty()
    private _imageName: string;
    @IsNotEmpty()
    @ApiProperty()
    private _repository: string;
    @IsNotEmpty()
    @ApiProperty()
    private _version: string;
    @ApiProperty()
    private _metadata : object;


    get imageName():string{
        return this._imageName
    }

    get repository():string{
        return this._repository;
    }

    get version():string{
        return this._version;
    }

    get metadata():object{
        return this._metadata;
    }

    set imageName(imageName: string){
        this._imageName = imageName;
    }

    set repository(repository: string){
        this._repository = repository;
    }

    set version(version: string){
        this._version = version;
    }
    set metadata(metadata: object){
        this._metadata = metadata;
    }





}


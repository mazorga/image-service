import { Injectable } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
@Injectable()
export class InputValidator{

    //todo check why @Min && @Max are breaking my app
    //I've just realized that genericInt is treated all the way as stirng '2' and not as number .....
    validateNumberInput(genericInt: number,min:number,max:number)
    {
        if(Number.isInteger(Number(genericInt)))
            {
                if(genericInt>min && genericInt < max)
                {
                    return
                }
            }
        throw new BadRequestException('Please check your input');
    }
}
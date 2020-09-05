import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AddLoyalityPoints{
    @ApiProperty({example:null})
    @IsNumber()
    loyality:number
}
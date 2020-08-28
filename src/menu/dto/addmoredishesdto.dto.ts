import { ApiProperty } from "@nestjs/swagger";
import {
    IsOptional,
    IsString,
    IsNumber,
  } from 'class-validator';
import { AddDishes } from "./AddDishes.dto";

export class AddMoreDish {

    @ApiProperty({example:null})
    menuId:string;

    @ApiProperty({example:null})
    resId:string;

    @ApiProperty({ type:AddDishes,isArray: true})
    dish: AddDishes[]; 
}
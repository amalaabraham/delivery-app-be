import { ApiProperty } from "@nestjs/swagger";
import {
    IsOptional,
    IsString,
    IsNumber,
  } from 'class-validator';

export class AddMoreDish {

    @ApiProperty({example:null})
    menuId:string;

    @ApiProperty({example:null})
    resId:string;


    @ApiProperty({ example: null })
  @IsString()
  name: string;

  @ApiProperty({ example: null })
  @IsNumber()
  price: number;

  @ApiProperty({ example:null })
  @IsOptional()
  photos:any;
}
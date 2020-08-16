import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { AddDishes } from './AddDishes.dto';

export class AddMenuDto {
  @ApiProperty({ example: null })
  @IsString()
  name: string;
  
  @ApiProperty({ type:AddDishes,isArray: true})
  dish: AddDishes[];

}
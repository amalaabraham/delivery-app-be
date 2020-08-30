import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: null,isArray:true })
  dishIds: any;

  @ApiProperty({ example: null,isArray:true })
  qty: any;

  @ApiProperty({example:null})
  restaurantId: string;

  @ApiProperty({example:null})
  @IsOptional()
  deliveryAdd:string;

  @ApiProperty({example:null})
  @IsOptional()
  deliveryDate:Date;

}
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class RestaurantFilterDto {

  @ApiProperty({required: false})
  @IsOptional()
  resname: string;

  @ApiProperty({required: false})
  @IsOptional()
  dish: string;

  @ApiProperty({required: false})
  @IsOptional()
  location: string;

  @ApiProperty({required: false})
  @IsOptional()
  rating: number;



}
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateDish {
  @ApiProperty({ example: null })
  resId: string;

  @ApiProperty({ example: null })
  menuId: string;

  @ApiProperty({ example: null })
  dishId: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ example: null })
  @IsOptional()
  photos: any;

  @ApiProperty({ example: null })
  @IsOptional()
  status: string;

  @ApiProperty({ example: null })
  @IsOptional()
  category: string;
}

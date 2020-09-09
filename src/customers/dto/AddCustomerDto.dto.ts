import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
export class AddCustomerDto {
  @ApiProperty({ example: null })
  @IsString()
  name: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsNumber()
  contact: number;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ example: null })
  @IsNumber()
  loyalty: number;
}

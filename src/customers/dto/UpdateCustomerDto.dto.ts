import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class UpdateCustomerDto {
  @ApiProperty({ example: null })
  @IsString()
  name: string;

  @ApiProperty({ example: null })
  @IsNumber()
  contact: number;

  @ApiProperty({ example: null })
  @IsString()
  email: string;

  @ApiProperty({ example: null })
  @IsNumber()
  loyalty: number;
}

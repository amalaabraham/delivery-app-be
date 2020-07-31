import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: null })
  @IsString()
  name: string;

  @ApiProperty({ example: null })
  @IsString()
  email: string;

  @ApiProperty({ required: false, example: null })
  @ApiProperty({ example: null })
  @IsString()
  @MinLength(8)
  @MaxLength(49)
  @Matches(/^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[0-9]+)(?=.*[!@#$%^&*]).{8,}$/, {
    message: 'Password too Weak',
  })
  password: string;

  @ApiProperty({ example: null })
  @IsString()
  confirm: string;

  @ApiProperty({ example: null })
  @IsString()
  type: string;

  @IsNumber()
  number: number;

  @IsNumber()
  location: number;
}

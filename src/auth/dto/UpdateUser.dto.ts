
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';
export class updateUserdto {
  @ApiProperty({ example: null })
  @IsNumber()
  number: string;

  @ApiProperty({ example: null })
  @IsString()
  name: string;

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
}
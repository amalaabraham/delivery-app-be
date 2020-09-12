import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class DateRangeDto{
  @ApiProperty({ example: null })
  @IsOptional()
  from: Date;

  @ApiProperty({ example: null })
  @IsOptional()
  to: Date;
}
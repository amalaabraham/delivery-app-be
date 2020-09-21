import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class AddReviews {
  
    @ApiProperty({ example: null })
    @IsOptional()
    feedback: string;
  
    @ApiProperty({ example: null })
    @IsNumber()
    star: number;
  
}
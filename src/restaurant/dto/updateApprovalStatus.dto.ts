import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateApprovalStatus {
  @ApiProperty({ example: null })
  @IsNumber()
  approval: number;
}
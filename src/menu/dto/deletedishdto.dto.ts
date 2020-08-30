import { ApiProperty } from '@nestjs/swagger';

export class DeleteDish {
  @ApiProperty({ example: null })
  menuId: string;

  @ApiProperty({ example: null })
  resId: string;

  @ApiProperty({ example: null })
  dishId: string;
}

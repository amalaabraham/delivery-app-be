import { ApiProperty } from '@nestjs/swagger';

export class editMenuName {
  @ApiProperty({ example: null })
  name: string;

  @ApiProperty({ example: null })
  menuId: string;
}

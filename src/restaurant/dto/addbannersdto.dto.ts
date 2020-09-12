import { ApiProperty } from "@nestjs/swagger";



export class AddBanners {
  @ApiProperty({ type: AddBanners, isArray: true })
  banner: any;
}
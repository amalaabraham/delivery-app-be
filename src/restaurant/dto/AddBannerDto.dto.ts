import { ApiProperty } from "@nestjs/swagger";
import { AddBanners } from "./addbannersdto.dto";


export class AddBanner {

  @ApiProperty({  example:null })
  banner: AddBanners[];
}
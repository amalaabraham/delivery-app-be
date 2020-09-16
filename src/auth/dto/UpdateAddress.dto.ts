import { ApiProperty } from "@nestjs/swagger";

export class UpdateAddress{
    @ApiProperty({example:null})
    address:any;
}
import { ApiProperty } from "@nestjs/swagger";

export class UpdateDeliveryStatus{
    @ApiProperty({ example: null })
    deliveryStatus:string;
}
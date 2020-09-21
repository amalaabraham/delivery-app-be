import { ApiProperty } from "@nestjs/swagger";
import { AddReviews } from "./AddReviewDto.dto";



export class AddReview {
 
  @ApiProperty({ type:AddReviews,isArray: true })
  review: AddReviews[];
}
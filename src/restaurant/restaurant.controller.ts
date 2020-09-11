import {
  Controller,
  Logger,
  Get,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  Delete,
  Patch,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { AuthGuard } from '@nestjs/passport';
import { ObjectID } from 'mongodb';
import { RestaurantregisterDto } from './dto/addrestaurantdto.dto';
import { UpdateRestaurantDto } from './dto/updatedto.dto';
import { Prop } from '@nestjs/mongoose';
import { RestaurantFilterDto } from './dto/restaurantfilterdto.dto';
import { UpdateApprovalStatus } from './dto/updateApprovalStatus.dto';

@ApiTags('Restaurant Management')
@Controller('api/v1/restaurant')
export class RestaurantController {
  private logger = new Logger('Restaurant Controller');
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('all-restaurant')
  getAllRestaurant() {
    this.logger.verbose(`retrieving all restaurants`);
    return this.restaurantService.getAllRestaurant();
  }

  @Get('/restaurantnum')
  restaurantnum() {
    this.logger.verbose(`retrieving restaurant number`);
    return this.restaurantService.getRestaurantNum();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/userRestaurants')
  getRestaurant(@Req() req: any) {
    this.logger.verbose('retrieving restaurant of the user');
    return this.restaurantService.getRestaurant(req.user);
  }

  @Get(':hotelId')
  getRestaurantById(@Req() req: any, @Param('hotelId') _id: string) {
    this.logger.verbose('restaurant retrieved');
    return this.restaurantService.getRestaurantById(req.user, _id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('add-restaurant')
  addrestaurant(
    @Body() restaurantregisterDto: RestaurantregisterDto,
    @Req() req: any,
  ) {
    this.logger.verbose('restaurant created');
    return this.restaurantService.addrestaurant(
      restaurantregisterDto,
      req.user,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  deleteRestaurant(@Req() req: any, @Param('id') id: string) {
    this.logger.verbose('restaurant removed');
    return this.restaurantService.deleteRestaurant(req.user, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id/update-Restaurant')
  updateRestaurant(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    this.logger.verbose('restaurant updated');
    return this.restaurantService.updateRestaurant(
      req.user,
      id,
      updateRestaurantDto,
    );
  }

  @Get('/filter/filter')
  filterrestaurant(@Query() filterDto: RestaurantFilterDto) {
    this.logger.verbose('filtering restaurant ');
    return this.restaurantService.filterrestaurant(filterDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('PendingApproval/:resId')
  acceptOrReject(@Req() req:any,@Param('resId') id: string,@Body() updateApproval:UpdateApprovalStatus)
  {
    this.logger.verbose('approve or reject');
    return this.restaurantService.acceptOrRejectRestaurant(req.user,id,updateApproval)
  }

  
}

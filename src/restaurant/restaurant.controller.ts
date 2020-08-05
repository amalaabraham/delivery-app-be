import { Controller, Logger, Get, UseGuards, Req, Param, ParseIntPipe, Post, UseInterceptors, Body, UploadedFile, Delete, Patch } from '@nestjs/common';
import {ApiBearerAuth} from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { AuthGuard } from '@nestjs/passport';
import { ObjectID } from 'mongodb';
import { RestaurantregisterDto } from './dto/addrestaurantdto.dto';
import { UpdateRestaurantDto } from './dto/updatedto.dto';


@Controller('api/v1/restaurant')
export class RestaurantController {
    private logger = new Logger('Restaurant Controller');
    constructor(private readonly restaurantService: RestaurantService) {
    }

    @Get("all-restaurant")
    getAllRestaurant() {
        this.logger.verbose(`retrieving all restaurants`);
        return this.restaurantService.getAllRestaurant();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get("/userRestaurants")
    getRestaurant(@Req() req:any){
        this.logger.verbose('retrieving restaurant of the user');
        return this.restaurantService.getRestaurant(req.user);
    }

    @Get(":hotelId")
    getRestaurantById(@Req() req:any,@Param ('hotelId',ParseIntPipe) hotelId :ObjectID) {
        this.logger.verbose("restaurant retrieved");
        return this.restaurantService.getRestaurantById(req.user,hotelId);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('add-restaurant')
    addrestaurant(
    @Body() restaurantregisterDto:RestaurantregisterDto,
    @Req() req:any,
     )
    {
        this.logger.verbose("restaurant created");
        return this.restaurantService.addrestaurant(restaurantregisterDto,req.user);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteRestaurant(@Req() req:any,@Param('id',ParseIntPipe)id:ObjectID) {
        this.logger.verbose("restaurant removed");
        return this.restaurantService.deleteRestaurant(req.user,id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch('/:id/update-Restaurant')
    updateRestaurant(
        @Req() req:any,
        @Param('id',ParseIntPipe) id:ObjectID,
        @Body() updateFacilityDto: UpdateRestaurantDto,
         )
        {
            this.logger.verbose("restaurant updated");
            return this.restaurantService.updateRestaurant(req.user,id, UpdateRestaurantDto);
        }






}

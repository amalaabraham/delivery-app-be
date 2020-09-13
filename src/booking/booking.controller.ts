import {
  Controller,
  Logger,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookingDto, DateRangeDto, UpdateDeliveryStatus } from './dto';

@ApiTags('Booking Management')
@Controller('api/v1/booking')
export class BookingController {
  private logger = new Logger('Booking Controller');
  constructor(private readonly bookingService: BookingService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('All_Bookings/:resId')
  getAllBookings(@Req() req, @Param('resId') id: string) {
    this.logger.verbose('Retreving all the bookings');
    return this.bookingService.getAllBookingOfRestuarant(req.user, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('CreateBooking')
  createBooking(@Req() req, @Body() bookingDto: CreateBookingDto) {
    this.logger.verbose('CreateBooking');
    console.log(req.user);
    return this.bookingService.createBooking(req.user, bookingDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('GetBookingDetail/:bookId')
  getBookingById(@Req() req, @Param('bookId') id: string) {
    this.logger.verbose('Retreive booking by bookid');
    return this.bookingService.getBookingById(req.user, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('GetBookingDetailOfUser')
  getBookingDetailOfUser(@Req() req) {
    this.logger.verbose('Retreive bookings of user');
    return this.bookingService.getAllBookingOfUser(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('getBookingOfRestaurantByDate/:resId')
  getBookingOfRestaurantByDate(@Req() req,@Param('resId') id:string,@Body() dateRangeDto:DateRangeDto){
    this.logger.verbose('getAllBookingsOfRestaurantByDate')
    return this.bookingService.getAllBookingsOfRestaurantByDate(req.user,id,dateRangeDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('updateBooking/:bookId')
  updateDeliveryStatus(@Req() requ,@Param('bookId') id:string,@Body() updateDeliveryStatus:UpdateDeliveryStatus){
    this.logger.verbose('updating delivery Status');
    return this.bookingService.updateDeliveryStatus(requ.user,id,updateDeliveryStatus);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('generateSalesReport/:resId')
  generateSalesReport(@Req() req,@Param('resId') id:string,@Body() dateRangeDto:DateRangeDto)
  {
    this.logger.verbose('generate sales report')
    return this.bookingService.generateSalesReport(req.user,id,dateRangeDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('generateItemReport/:resId')
  generateItemReport(@Req() req,@Param('resId') id:string,@Body() dateRangeDto:DateRangeDto){
    this.logger.verbose('generate item sales report')
    return this.bookingService.generateItemsReport(req.user,id,dateRangeDto);
  }
}

import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/Booking.entity';
import { BookingRepository } from './booking.repository';
import { RestaurantRepository } from 'src/restaurant/restaurant.repository';
import { UserRepository } from 'src/auth/user.repository';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { MenuRepository } from 'src/menu/menu.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([Booking,BookingRepository]),
    TypeOrmModule.forFeature([RestaurantRepository]),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([MenuRepository]),
    RestaurantModule
  ],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}

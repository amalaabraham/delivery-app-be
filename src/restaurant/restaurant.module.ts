import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './entities/Restaurant.entity';
import { RestaurantRepository } from './restaurant.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { MenuRepository } from 'src/menu/menu.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([Restaurant, RestaurantRepository]),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([MenuRepository]),
],

  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports:[RestaurantService]
})
export class RestaurantModule {}

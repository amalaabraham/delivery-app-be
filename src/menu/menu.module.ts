import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { RestaurantRepository } from 'src/restaurant/restaurant.repository';
import { Menu } from './entities/Menu.entity';
import { MenuRepository } from './menu.repository';
import { Restaurant } from 'src/restaurant/entities/Restaurant.entity';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Menu,MenuRepository]),
    TypeOrmModule.forFeature([RestaurantRepository]),
    TypeOrmModule.forFeature([UserRepository]),
    RestaurantModule
  ],
  providers: [MenuService],
  controllers: [MenuController],
  exports: [MenuService]
})
export class MenuModule {}

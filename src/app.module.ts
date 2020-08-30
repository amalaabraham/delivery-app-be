import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { MONGOURI } from '../keys';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/User.entity';
import { UserRepository } from './auth/user.repository';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantController } from './restaurant/restaurant.controller';
import { MenuModule } from './menu/menu.module';
import { MenuController } from './menu/menu.controller';
import { BookingModule } from './booking/booking.module';
import { BookingController } from './booking/booking.controller';
@Module({
  imports: [
    AuthModule,
    RestaurantModule,
    MenuModule,
    BookingModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url:
        'mongodb+srv://jishnu:jishnu@expo.pech5.mongodb.net/jishnu?retryWrites=true&w=majority',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: true,
      synchronize: true,
      logging: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    AuthModule,
    RestaurantModule,
    MenuModule,
    BookingModule,
  ],
  controllers: [
    AuthController,
    RestaurantController,
    MenuController,
    BookingController,
  ],
  providers: [],
})
export class AppModule {}

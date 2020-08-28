import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGOURI } from '../keys';
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
@Module({
  imports: [
    AuthModule,
    RestaurantModule,
    MenuModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: MONGOURI,
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
  controllers: [AuthController,RestaurantController,MenuController],
  providers: [],
})
export class AppModule {}

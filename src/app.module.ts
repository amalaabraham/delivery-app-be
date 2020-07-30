import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGOURI } from '../keys';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/User.entity';
import { UserRepository } from './auth/user.repository';
@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
    type: 'mongodb',
    url: MONGOURI,
    entities: [
      __dirname + '/**/*.entity{.ts,.js}',
    ],
    ssl: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  }), AuthModule,],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGOURI } from '../src/keys';
console.log(MONGOURI);
@Module({
  imports: [MongooseModule.forRoot(MONGOURI)],
  controllers: [],
  providers: [],
})
export class AppModule {}

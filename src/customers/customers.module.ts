import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './entities/Customer.entity';
import { CustomerRepository } from './customer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerRepository]),
  TypeOrmModule.forFeature([UserRepository])],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule {}

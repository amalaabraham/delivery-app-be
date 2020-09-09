import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from './customer.repository';
import { Customer } from './entities/Customer.entity';
import { User } from 'src/auth/entities/User.entity';
import { AddCustomerDto } from './dto/AddCustomerDto.dto';
import { UserRepository } from 'src/auth/user.repository';
import { UpdateCustomerDto, AddLoyalityPoints } from './dto';
import { ObjectID } from 'typeorm';

const ObjectId = require('mongodb').ObjectID;
@Injectable()
export class CustomersService {
  private logger = new Logger('Customer service');
  constructor(
    @InjectRepository(CustomerRepository)
    @InjectRepository(UserRepository)
    private readonly customerRepository: CustomerRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async addCustomer(user: User, data: AddCustomerDto): Promise<any> {
    try {
      return await this.customerRepository.addCustomer(user, data);
    } catch (E) {
      console.log(E);
      return "unsuccessfull"+E;
    }
  }

  async getCustomer(user: User): Promise<any> {
    console.log(ObjectId(user.id));
    const users = await this.userRepository.findOne(ObjectId(user.id));
    console.log(users);
    if (users.type == 'owner') {
      return await this.customerRepository.find({ resId: users.id.toString() });
    } else {
      return 'unauthorized';
    }
  }

  async updateCustomer(user: User, id, data: UpdateCustomerDto): Promise<any> {
    const customer = await this.customerRepository.findOne(ObjectId(id));
    if (customer) {
      if (customer.resId == user.id) {
        if (data.name) {
          customer.name = data.name;
        }
        if (data.contact) {
          customer.contact = data.contact;
        }
        if (data.email) {
          customer.email = data.email;
        }
        if (data.loyalty) {
          customer.loyalty = data.loyalty;
        }
        await this.customerRepository.save(customer);
        return {
          success: true,
          message: 'customer updated',
        };
      } else {
        return 'unauthorized';
      }
    } else {
      return {
        success: false,
        message: 'no such customer',
      };
    }
  }
  async deleteCustomer(user: User, id): Promise<any> {
    const customer = await this.customerRepository.findOne(ObjectId(id));
    if (customer) {
      if (user.id == customer.resId) {
        await this.customerRepository.remove(customer);
        return {
          success: true,
          message: 'customer deleted successfully',
        };
      } else {
        return 'unauthorized';
      }
    } else {
      return {
        success: false,
        message: 'no such customer',
      };
    }
  }

  async addLoyalityPoints(user:User,id,data:AddLoyalityPoints):Promise<any>{
    const customer = await this.customerRepository.findOne(ObjectId(id));
    if (customer) {
      if (user.id == customer.resId) {
        customer.loyalty+=data.loyality;
      }else {
        return 'unauthorized';
      }
    } else {
      return {
        success: false,
        message: 'no such customer',
      };
    }
    }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from './customer.repository';
import { Customer } from './entities/Customer.entity';
import { User } from 'src/auth/entities/User.entity';
import { AddCustomerDto } from './dto/AddCustomerDto.dto';
import { UserRepository } from 'src/auth/user.repository';

const ObjectId = require('mongodb').ObjectID;
@Injectable()
export class CustomersService {
    private logger = new Logger("Customer service")
    constructor(
        @InjectRepository(CustomerRepository)
        @InjectRepository(UserRepository)
        private readonly customerRepository:CustomerRepository,
        private readonly userRepository:UserRepository,
    ){}
    async addCustomer(user:User,data:AddCustomerDto):Promise<any>{
        try{
            return await this.customerRepository.addCustomer(user,data);
        }
        catch(E){
            console.log(E);
        }
    }

    async getCustomer(user:User):Promise<any>{
        console.log(ObjectId(user.id))
        const users = await this.userRepository.findOne(ObjectId(user.id));
        console.log(users)
        if(users.type == "owner")
        {
            return await this.customerRepository.find({resId:users.id.toString()})
        }
        else{
            return 'unauthorized'
        }
    }
}

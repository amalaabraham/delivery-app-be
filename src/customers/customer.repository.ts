import { Customer } from './entities/Customer.entity';
import { EntityRepository, MongoRepository } from 'typeorm';
import { User } from 'src/auth/entities/User.entity';
import { AddCustomerDto } from './dto/AddCustomerDto.dto';

@EntityRepository(Customer)
export class CustomerRepository extends MongoRepository<Customer> {
  async addCustomer(user: User, data: AddCustomerDto): Promise<any> {
    const customer = new Customer();
    customer.resId = user.id;
    customer.name = data.name;
    customer.email = data.email;
    customer.contact = data.contact;
    customer.loyalty = data.loyalty;
    await this.save(customer);
    return customer;
  }
}

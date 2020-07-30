import { EntityRepository, Repository, MongoRepository } from 'typeorm';
import { User } from './entities/User.entity';

@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {

}

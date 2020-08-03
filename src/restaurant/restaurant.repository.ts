import { EntityRepository, MongoRepository } from 'typeorm';
import { Restaurant } from './entities/Restaurant.entity';

@EntityRepository(Restaurant)
export class RestaurantRepository extends MongoRepository<Restaurant> {

}

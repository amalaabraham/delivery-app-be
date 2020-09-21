import {
  Injectable,
  Logger,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { User } from 'src/auth/entities/User.entity';
import { ObjectID } from 'typeorm';
import { IsMongoId } from 'class-validator';
import { RestaurantFilterDto } from './dto/restaurantfilterdto.dto';
import { MenuRepository } from 'src/menu/menu.repository';
import { UpdateApprovalStatus } from './dto/updateApprovalStatus.dto';
import { AddBanner } from './dto/AddBannerDto.dto';
import { AddReview } from './dto/addreviewsdto.dto';
import { AddReviews } from './dto/AddReviewDto.dto';
const ObjectId = require('mongodb').ObjectID;

@Injectable()
export class RestaurantService {
  private logger = new Logger('Restaurant Service');

  constructor(
    @InjectRepository(RestaurantRepository)
    @InjectRepository(UserRepository)
    @InjectRepository(MenuRepository)
    private readonly restaurantRepository: RestaurantRepository,
    private readonly userRepository: UserRepository,
    private readonly menuRepository: MenuRepository,
  ) {}

  async getAllRestaurant(): Promise<any> {
    const restaurant = await this.restaurantRepository.find();
    const ActiveRestaurants = restaurant.filter(obj => obj.status === 'ACTIVE');
    return ActiveRestaurants;
  }

  async validateUser(user: User): Promise<any> {
    // console.log(user.id)
    const found = await this.userRepository.findOne(ObjectId(user.id));
    // console.log(found);
    //console.log(found.type,found.email)
    if (found.type === 'owner' || found.type === 'admin') {
      //  console.log(found);
      return found;
    } else {
      throw new UnauthorizedException('You are not authorized!!');
    }
  }

  async getRestaurant(user: User): Promise<any> {
    if (await this.validateUser(user)) {
      const restaurant = await this.restaurantRepository.find({
        ownerID: user.id,
      });
      if (restaurant) {
        const ActiveRestaurants = restaurant.filter(
          obj => obj.status === 'ACTIVE',
        );
        const { ...results } = ActiveRestaurants;
        return {
          success: true,
          message: 'restaurants retrieved',
          data: results,
        };
      } else {
        return {
          success: false,
          message: 'No restaurants exist',
        };
      }
    } else {
      throw new HttpException('Action Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async getRestaurantById(user: User, id): Promise<any> {
    try {
      const restaurant = await this.restaurantRepository.findOne(ObjectId(id));
      if (restaurant.status === 'ACTIVE') {
        return restaurant;
      } else {
        throw new NotFoundException('No Such Restaurant');
      }
    } catch (e) {}
  }

  async addrestaurant(data: any, user: User): Promise<any> {
    try {
      // console.log(user);
      //  console.log(data);
      //  console.log(user.id);
      if (await this.validateUser(user)) {
        // console.log(user.id);
        data.ownerID = user.id;
        return this.restaurantRepository.createRestaurant(data, user.id);
      } else {
        throw new HttpException('Action Forbidden', HttpStatus.FORBIDDEN);
      }
    } catch (e) {
      return e;
    }
  }

  async findHotel(user: User, id: ObjectID): Promise<any> {
    const found = await this.userRepository.findOne(ObjectId(user.id));
    const hotel = await this.restaurantRepository.findOne(ObjectId(id));
    // console.log(found)
    //  console.log(hotel)
    if (
      (found.type === 'owner' && ObjectId(hotel.ownerID).equals(found.id)) ||
      found.type === 'admin'
    ) {
      //  console.log(found)
      return found;
    } else {
      throw new UnauthorizedException();
    }
  }

  async deleteRestaurant(user: User, id): Promise<any> {
    if (await this.findHotel(user, id)) {
      const restaurant = await this.restaurantRepository.findOne(ObjectId(id));
      if (restaurant) {
        restaurant.status = 'NOT_AVAILABLE';
        await this.restaurantRepository.save(restaurant);
        return {
          sucess: true,
          message: 'Deleted Successfully',
        };
      } else {
        return {
          sucess: false,
          message: 'Deletion Failed',
        };
      }
    }
  }

  async updateRestaurant(user: User, id, data: any): Promise<any> {
    if (await this.findHotel(user, id)) {
      const restaurant = await this.restaurantRepository.findOne(ObjectId(id));
      if (restaurant) {
        if (data.name) {
          restaurant.name = data.name;
        }
        if (data.address) {
          restaurant.address = data.address;
        }
        if (data.location) {
          restaurant.location = data.location;
        }
        if (data.contact) {
          restaurant.contact = data.contact;
        }
        if (data.status) {
          restaurant.status = data.status;
        }
        if (data.timings) {
          restaurant.timings = data.timings;
        }
        if (data.photos) {
          restaurant.photos = data.photos;
        }
        await this.restaurantRepository.save(restaurant);
        const { ...result } = restaurant;
        return {
          success: true,
          data: result,
        };
      } else {
        return {
          sucess: false,
          message: 'Updatation failed',
        };
      }
    }
  }

  async filterrestaurant(
    restaurantfilterdto: RestaurantFilterDto,
  ): Promise<any> {
    const { resname, dish, location, rating } = restaurantfilterdto;
    let restaurantname,
      restaurantlocation,
      menudish,
      restaurantdish,
      restaurantrating,
      restaurant;
    restaurant = await this.restaurantRepository.find({ approved: 1 });

    var restauranttest = [];
    const _ = require('lodash');

    console.log(resname, dish, location, rating);

    console.log(resname);
    if (resname) {
      restaurantname = await this.restaurantRepository.find({ name: resname });
      restaurant = _.intersectionWith(restaurant, restaurantname, _.isEqual);

      //restauranttest = restaurant.map((item, i) => Object.assign({}, item, restaurantname[i]));
    }
    if (location) {
      restaurantlocation = await this.restaurantRepository.find({
        location: location,
      });
      restaurant = _.intersectionWith(
        restaurant,
        restaurantlocation,
        _.isEqual,
      );
    }
    if (dish) {
      menudish = await this.menuRepository.find();
      //console.log(menudish)
      for (var i = 0; i < menudish.length; i++) {
        for (var j = 0; j < menudish[i].dishes.length; j++) {
          if (menudish[i].dishes[j].name === dish) {
            restaurantdish = await this.restaurantRepository.findOne(
              ObjectId(menudish[i].restaurantId),
            );
            restauranttest.push(restaurantdish);
          }
        }
      }
      restaurant = _.intersectionWith(restaurant, restauranttest, _.isEqual);
    }
    if (rating) {
      restaurantrating = await this.restaurantRepository.find({
        rating: rating,
      });
      console.log(restaurantrating);
      restaurant = _.intersectionWith(restaurant, restaurantrating, _.isEqual);
    }

    return restaurant;

    //let intersection = restaurantname.filter(x => restaurantlocation.includes(x));
  }

  async acceptOrRejectRestaurant(
    user: User,
    id,
    data: UpdateApprovalStatus,
  ): Promise<any> {
    const user1 = await this.userRepository.findOne(ObjectId(user.id));
    if (user1.type == 'admin') {
      const restaurant = await this.restaurantRepository.findOne(ObjectId(id));
      if (restaurant) {
        if (data.approval == 1) {
          restaurant.approved = 1;
          await this.restaurantRepository.save(restaurant);
          return {
            success: true,
            message: 'Approved',
          };
        } else {
          await this.restaurantRepository.remove(restaurant);
          return {
            success: true,
            message: 'Rejected',
          };
        }
      } else {
        return 'restaurant not found';
      }
    } else {
      return 'unauthorized';
    }
  }

  async getRestaurantNum(): Promise<any> {
    const [restaurant, count] = await this.restaurantRepository.findAndCount({
      status: 'ACTIVE',
      approved: 1,
    });
    return count;
  }

  async addBanner(addbanner: AddBanner, user: User, id): Promise<any> {
    try {
      if (await this.findHotel(user, ObjectId(id))) {
        return this.restaurantRepository.addBanner(addbanner, user, id);
      }
    } catch (e) {
      throw new HttpException({ message: e }, HttpStatus.BAD_REQUEST);
    }
  }

  async updatebanner(addbanner: AddBanner, user: User, id): Promise<any> {
    try {
      if (await this.findHotel(user, ObjectId(id))) {
        return this.restaurantRepository.updateBanner(addbanner, user, id);
      }
    } catch (e) {
      throw new HttpException({ message: e }, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteBanner(user: User, id, bannerid): Promise<any> {
    if (await this.findHotel(user, ObjectId(id))) {
      //const restaurant = await this.restaurantRepository.findOne(ObjectId(id))
      const restaurant = await this.restaurantRepository.findOne(ObjectId(id));
      if (restaurant) {
        for (var i = 0; i < restaurant.banner.length; i++) {
          if (restaurant.banner[i].bannerId == bannerid) {
            break;
          }
        }
        // await this.menuRepository.delete(menu.dishes[i]);
        restaurant.banner.splice(i, 1);
        //delete menu.dishes[i];
        await this.restaurantRepository.save(restaurant);

        //const afterdeletemenu = await this.menuRepository.findOne(ObjectId(dish.menuId))
        //console.log(afterdeletemenu)
        return {
          sucess: true,
          message: 'Deleted Successfully',
        };
      } else {
        return {
          sucess: false,
          message: 'Deletion Failed',
        };
      }
    }
  }

  async addReview( review: AddReviews, user: User,resid): Promise<any> {
    try {
      console.log(user);
       
        return this.restaurantRepository.addReview( review,user,resid);
    } catch (e) {
      throw new HttpException({ message: e }, HttpStatus.BAD_REQUEST);
    }
  }

  async getRestaurantReview(user: User, id): Promise<any> {
    
    try {
      
      var restaurant = await this.restaurantRepository.findOne(ObjectId(id));
      const length = restaurant.review.length;
      for (var i=0;i<length;i++)
      {
      const user = await this.userRepository.findOne(ObjectId(restaurant.review[i].userId));
     restaurant.review[i]['username'] = user.name;
      
      }
      
      return restaurant.review;
      
      
    } catch (e) {}
  }

}

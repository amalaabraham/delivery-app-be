import { Injectable, Logger, UnauthorizedException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { User } from 'src/auth/entities/User.entity';
import { ObjectID } from "typeorm";

@Injectable()
export class RestaurantService {
    private logger = new Logger('Restaurant Service');

  constructor(
    @InjectRepository(RestaurantRepository)
    @InjectRepository(UserRepository)
    private readonly restaurantRepository: RestaurantRepository,
    private readonly userRepository:UserRepository
  ) {}

  async getAllRestaurant(): Promise<any> {
    return await this.restaurantRepository.find();
}

async validateUser(user:User): Promise<any> {
    console.log(user.id)
    const found = await this.userRepository.findOne({id:user.id,});
    console.log(found);
    //console.log(found.type,found.email)
    if(found.type === 'owner'){
        console.log(found);
        return found;
    }
    else {
        throw new UnauthorizedException('You are not authorized!!');
    }
}

async getRestaurant(user:User): Promise<any> {
    
   
    if(await this.validateUser(user)){
    
    const restaurant = await this.restaurantRepository.find({ ownerID:user.id })
    if(restaurant) {
        const {...result}=restaurant;
        return{
            success:true,
            message:"restaurants retrieved",
            data:result
        };
    }
    else {
        return{
            success:false,
            message:"No restaurants exist"
        }
    }
}
else{
    throw new HttpException("Action Forbidden",HttpStatus.FORBIDDEN);
}
}

async getRestaurantById(user:User,id):Promise<any>{
        
    const restaurant = await this.restaurantRepository.findOne({id});
    if(restaurant)
    {
        return restaurant;
    }
    else {
        throw new NotFoundException("No Such Restaurant")
    }

}

async addrestaurant(data:any,user:User): Promise<any> {
    try{
        console.log(user);
        console.log(data);
        console.log(user.id);
            if(await this.validateUser(user))
            {
                console.log(user.id);
                data.ownerID=user.id;
                return this.restaurantRepository.createRestaurant(data,user.id);
            }
            else
            {
                throw new HttpException("Action Forbidden",HttpStatus.FORBIDDEN);
            }
        
        } catch(e)
        {
            return e;
        }
}

async findHotel(user:User,id:ObjectID): Promise<any>{
    const found =await this.userRepository.findOne({id:user.id})
    const hotel = await this.restaurantRepository.findOne({id:id})
    if((found.type === 'owner' && hotel.ownerID === found.id)){
        return found
    }
    else {
        throw new UnauthorizedException;
    }
}

async deleteRestaurant(user:User,id):Promise<any> {
    if(await this.findHotel(user,id)){
    const restaurant = await this.restaurantRepository.findOne({ id:id })
    if(restaurant){
        restaurant.status = "NOT_AVAILABLE"
    await this.restaurantRepository.save(restaurant);
    return{
        sucess:true,
        message: 'Deleted Successfully'
    }
}
    else{
        return{
            sucess:false,
            message: 'Deletion Failed'
        }
    }
}


}

async updateRestaurant(user:User,id,data:any): Promise <any> {

    if(await this.findHotel(user,id)){
    const restaurant = await this.restaurantRepository.findOne({id:id })
    if(restaurant){
        if(data.name) {
            restaurant.name=data.name
        }
        if(data.address) {
            restaurant.address=data.address
        }
        if(data.latitude) {
            restaurant.location = data.location
        }
        if(data.contact){
            restaurant.contact= data.contact;
        }
        if(data.status){
            restaurant.status=data.status
        }
        if(data.menulist){
            restaurant.menulist=data.menulist
        }
        if(data.photos){
            restaurant.photos=data.photos
        }
        await this.restaurantRepository.save(restaurant);
        const {...result} = restaurant
        return {
            success:true,
            data: result
        };
    }
    else {
        return {
            sucess:false,
            message: "Updatation failed"
        }
    }
}
}


}
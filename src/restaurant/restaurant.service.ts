import { Injectable, Logger, UnauthorizedException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { User } from 'src/auth/entities/User.entity';
import { ObjectID } from "typeorm";
import { IsMongoId } from 'class-validator';
import { RestaurantFilterDto } from './dto/restaurantfilterdto.dto';
import { MenuRepository } from 'src/menu/menu.repository';
const ObjectId = require('mongodb').ObjectID;

@Injectable()
export class RestaurantService {
    private logger = new Logger('Restaurant Service');

  constructor(
    @InjectRepository(RestaurantRepository)
    @InjectRepository(UserRepository)
    @InjectRepository(MenuRepository)
    private readonly restaurantRepository: RestaurantRepository,
    private readonly userRepository:UserRepository,
    private readonly menuRepository:MenuRepository
  ) {}

  async getAllRestaurant(): Promise<any> {
    return await this.restaurantRepository.find();
}

async validateUser(user:User): Promise<any> {
   // console.log(user.id)
    const found = await this.userRepository.findOne(ObjectId(user.id));
   // console.log(found);
    //console.log(found.type,found.email)
    if(found.type === 'owner'){
      //  console.log(found);
        return found;
    }
    else {
        throw new UnauthorizedException('You are not authorized!!');
    }
}

async getRestaurant(user:User): Promise<any> {
    
   
    if(await this.validateUser(user)){
    
    const restaurant = await this.restaurantRepository.find({ ownerID:user.id}  )
    var results = [];
    if(restaurant ) {
        for(var i=0;i<restaurant.length;i++)
        {
            if(restaurant[i].status === "ACTIVE")
             {results.push(restaurant[i]); }
        }
        return{
            success:true,
            message:"restaurants retrieved",
            data:results
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

    const restaurant = await this.restaurantRepository.findOne(ObjectId(id));
    if(restaurant.status==="ACTIVE")
    {
        return restaurant;
    }
    else {
        throw new NotFoundException("No Such Restaurant")
    }

}

async addrestaurant(data:any,user:User): Promise<any> {
    try{
       // console.log(user);
      //  console.log(data);
      //  console.log(user.id);
           if(await this.validateUser(user))
            {
               // console.log(user.id);
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
    const found =await this.userRepository.findOne(ObjectId(user.id))
    const hotel = await this.restaurantRepository.findOne(ObjectId(id))
   // console.log(found)
  //  console.log(hotel)
    if(found.type === 'owner' && ObjectId(hotel.ownerID) .equals(found.id)){
       
      //  console.log(found)
        return found
    }

    else {
        throw new UnauthorizedException;
    }
}

async deleteRestaurant(user:User,id):Promise<any> {
    if(await this.findHotel(user,id)){
    const restaurant = await this.restaurantRepository.findOne(ObjectId(id))
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
    const restaurant = await this.restaurantRepository.findOne(ObjectId(id))
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

async filterrestaurant(restaurantfilterdto:RestaurantFilterDto): Promise <any> {
    const {resname,dish,location,rating} = restaurantfilterdto;
    let restaurantname,restaurantlocation,menudish,restaurantdish,restaurantrating,restaurant;
    restaurant = await this.restaurantRepository.find()

   var restauranttest = [];
    const _ = require("lodash"); 
 
 
    console.log(resname,dish,location,rating)
    
    console.log(resname)
    if (resname)
    {
         restaurantname = await this.restaurantRepository.find({name:resname})
          restaurant = _.intersectionWith( 
            restaurant, restaurantname, _.isEqual);

        //restauranttest = restaurant.map((item, i) => Object.assign({}, item, restaurantname[i]));

    }
    if (location)
    {
         restaurantlocation = await this.restaurantRepository.find({location:location});
         restaurant = _.intersectionWith( 
            restaurant, restaurantlocation, _.isEqual);


    }
    if (dish){
        menudish = await this.menuRepository.find()
        //console.log(menudish)
        for(var i = 0; i < menudish.length; i++)
        {
            for (var j=0;j<menudish[i].dishes.length;j++)
            {
            if(menudish[i].dishes[j].name === dish)
            {
                restaurantdish = await this.restaurantRepository.findOne(ObjectId(menudish[i].restaurantId)) 
                restauranttest.push(restaurantdish) 
             }
            }
        }
        restaurant = _.intersectionWith( 
            restaurant, restauranttest, _.isEqual);
      

        
    }
    if (rating)
    {
         restaurantrating = await this.restaurantRepository.find({rating:rating});
         console.log(restaurantrating);
         restaurant = _.intersectionWith( 
            restaurant, restaurantrating, _.isEqual);

    }

     
    return restaurant;
  
    //let intersection = restaurantname.filter(x => restaurantlocation.includes(x));
}

}

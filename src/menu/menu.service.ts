import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuRepository } from './menu.repository';
import { UserRepository } from 'src/auth/user.repository';
import { RestaurantRepository } from 'src/restaurant/restaurant.repository';
import { AddMenuDto, AddDishes } from './dto';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { User } from 'src/auth/entities/User.entity';
const ObjectId = require('mongodb').ObjectID;

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuRepository)
        @InjectRepository(UserRepository)
        @InjectRepository(RestaurantRepository)
        private readonly menuRepository:MenuRepository,
        private readonly userRepository:UserRepository,
        private readonly restaurantRepository:RestaurantRepository,
        
        private readonly restaurantService:RestaurantService,
    )
    {}

    async getMenuById(id):Promise<any>{
        const restaurant = await this.restaurantRepository.findOne(ObjectId(id))
        console.log(restaurant)
        if(restaurant)
        {
            const menuList = await this.menuRepository.find({restaurantId:id})
            console.log(menuList)
            if(menuList.length > 0)
            {
                return {
                    success:true,
                    message:'Menu Retrieved',
                    data:menuList
                }
            }
            else
            {
                throw new NotFoundException({message:'Menu For this Restaurant Not Found'})
            }
        }
        else
        {
            throw new NotFoundException({message:'Restaurant Not Found'})
        }
    }


    async AddMenu(id,menu:AddMenuDto,user:User):Promise<any>{
        try{
            console.log("hi")
            console.log(user)
            console.log(id)
            if(await this.restaurantService.findHotel(user,id))
            {
                return this.menuRepository.addMenu(id,menu);

            }
        }
        catch(e)
        {
            throw new HttpException({message:e},HttpStatus.BAD_REQUEST);
        }
    }
    
    async getDishesByMenu(id):Promise<any>{
        try{
            const menu = await this.menuRepository.findOne(ObjectId(id))
            if(menu)
            {
                return {
                    success:true,
                    message:'Dishes Retrieved',
                    data:menu.dishes
                }
            }
            else{
                throw new NotFoundException({message:'Menu Not Found'})
            }
        }
        catch(e)
        {
            throw new HttpException({message:e},HttpStatus.BAD_REQUEST)
        }
    }

    async getDishesByRestaurant(id):Promise<any>{
        const menu = await this.menuRepository.find({restaurantId:id})
        var result = [];
        
        if(menu.length>0)
        {
            for(var i=0;i<menu.length;i++)
            {
                result.push(menu[i]);
            }
            return {
                success:true,
                message:'dishes retrieved',
                data:result
            }
        }
        else{
            throw new NotFoundException({message:'Dishes not Found'})
        }
    }
}

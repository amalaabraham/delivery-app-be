import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuRepository } from './menu.repository';
import { UserRepository } from 'src/auth/user.repository';
import { RestaurantRepository } from 'src/restaurant/restaurant.repository';
import { AddMenuDto, AddDishes } from './dto';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { User } from 'src/auth/entities/User.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuRepository)
        @InjectRepository(UserRepository)
        @InjectRepository(RestaurantRepository)
        private readonly restaurantRepository:RestaurantRepository,
        private readonly userRepository:UserRepository,
        private readonly menuRepository:MenuRepository,
        private readonly restaurantService:RestaurantService,
    )
    {}

    async getMenuById(id:any):Promise<any>{
        const restaurant = await this.restaurantRepository.findOne({id:id})
        if(restaurant)
        {
            const menuList = await this.menuRepository.find({restaurantId:id})
            if(menuList)
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


    async AddMenu(user:any,id:any,menu:AddMenuDto):Promise<any>{
        try{
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
    
    async getDishesByMenu(id:any):Promise<any>{
        try{
            const menu = await this.menuRepository.findOne({id:id})
            if(menu)
            {
                return {
                    success:true,
                    message:'Menu Retrieved',
                    data:menu
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

    async getDishesByRestaurant(id:any):Promise<any>{
        const menu = await this.menuRepository.find({restaurantId:id})
        var result;
        if(menu.length>0)
        {
            for(var i=0;i<menu.length;i++)
            {
                result.append(menu[i].dishes);
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

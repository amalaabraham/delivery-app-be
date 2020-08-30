import { EntityRepository, MongoRepository } from "typeorm";
import { Menu } from "./entities/Menu.entity";
import { AddDishes, AddMenuDto } from "./dto";
import {v1 as uuidv1} from 'uuid';
import { ObjectID } from "mongodb";
import { AddMoreDish } from "./dto/addmoredishesdto.dto";
import { RestaurantRepository } from "src/restaurant/restaurant.repository";
const ObjectId = require('mongodb').ObjectID;


@EntityRepository(Menu)
export class MenuRepository extends MongoRepository<Menu>{
    async addMenu(id,menuDetail:AddMenuDto,restaurantRepository:RestaurantRepository):Promise<any>
    {
        const restaurant = await restaurantRepository.findOne(ObjectId(id))
        const {name,dish}=menuDetail;
        
        const menu = new Menu();
        menu.name=name;
        for (var i=0;i<dish.length;i++)
        {
            dish[i]['dishId']= new ObjectID();
            restaurant.totaldishprice += dish[i].price;
        }
        menu.dishes=dish;
        menu.restaurantId=id;
        menu.status="ACTIVE";
        restaurant.noofdishes += dish.length;
        const avg = restaurant.totaldishprice / restaurant.noofdishes;
        if (avg<=500)
            restaurant.rating = 1;
        else if (avg<=1000)
            restaurant.rating = 2;
        else 
            restaurant.rating = 3;
        await restaurantRepository.save(restaurant)
        await this.save(menu)
        console.log(menu);
        return menu;


    }
    async addDish(adddish: AddMoreDish,id,menu:Menu,restaurantRepository:RestaurantRepository):Promise<any>
    {
        const {menuId,resId,dish}=adddish;
        const restaurant = await restaurantRepository.findOne(ObjectId(resId))
        
        for (var i=0;i<dish.length;i++)
        {
            dish[i]['dishId']= new ObjectID();
            menu.dishes.push(dish[i]);
            restaurant.totaldishprice += dish[i].price;
        }
        restaurant.noofdishes += dish.length;
        const avg = restaurant.totaldishprice / restaurant.noofdishes;
        if (avg<=500)
            restaurant.rating = 1;
        else if (avg<=1000)
            restaurant.rating = 2;
        else 
            restaurant.rating = 3;
        await restaurantRepository.save(restaurant)
        await this.save(menu)
        console.log(menu);
        return menu;

    }

}
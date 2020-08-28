import { EntityRepository, MongoRepository } from "typeorm";
import { Menu } from "./entities/Menu.entity";
import { AddDishes, AddMenuDto } from "./dto";
import {v1 as uuidv1} from 'uuid';
import { ObjectID } from "mongodb";
import { AddMoreDish } from "./dto/addmoredishesdto.dto";


@EntityRepository(Menu)
export class MenuRepository extends MongoRepository<Menu>{
    async addMenu(id,menuDetail:AddMenuDto):Promise<any>
    {
        const {name,dish}=menuDetail;
        
        const menu = new Menu();
        menu.name=name;
        for (var i=0;i<dish.length;i++)
        {
            dish[i]['dishId']= new ObjectID();
        }
        menu.dishes=dish;
        menu.restaurantId=id;
        menu.status="ACTIVE";
        await this.save(menu)
        console.log(menu);
        return menu;


    }
    async addDish(adddish: AddMoreDish,id,menu:Menu):Promise<any>
    {
        const {menuId,resId,dish}=adddish;
        
        for (var i=0;i<dish.length;i++)
        {
            dish[i]['dishId']= new ObjectID();
            menu.dishes.push(dish[i]);
        }
        
        await this.save(menu)
        console.log(menu);
        return menu;

    }

}
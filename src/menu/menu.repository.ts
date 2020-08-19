import { EntityRepository, MongoRepository } from "typeorm";
import { Menu } from "./entities/Menu.entity";
import { AddDishes, AddMenuDto } from "./dto";


@EntityRepository(Menu)
export class MenuRepository extends MongoRepository<Menu>{
    async addMenu(id,menuDetail:AddMenuDto):Promise<any>
    {
        const {name,dish}=menuDetail;
        
        const menu = new Menu();
        menu.name=name;
        menu.dishes=dish;
        menu.restaurantId=id;
        await this.save(menu)
        console.log(menu);
        return menu;


    }
}
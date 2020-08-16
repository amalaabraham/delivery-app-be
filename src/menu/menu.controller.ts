import { Controller, Logger, Get, Param, ParseIntPipe, Post, Body, Req } from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { AddMenuDto } from './dto';

@ApiTags('Menu Management')
@Controller('api/v1/menu')
export class MenuController {
    private logger =new  Logger('Restaurant Controller');
    constructor(private readonly menuService: MenuService){}

    @Get('menu/:resId')
    getMenuById(@Param('resId') id:any)
    {
        this.logger.verbose("retrieving Menu")
        return this.menuService.getMenuById(id);
    }

    @Get('dishes/:menuId')
    getDishesByMenuId(@Param('menuId') id:any)
    {
        this.logger.verbose('retrieving dishes by menu')
        return this.menuService.getDishesByMenu(id);
    }

    @Get('dishes/:resId')
    getDishesByRestaurantId(@Param('resId') id:any)
    {
        this.logger.verbose('retrieving dishes by restaurant Id')
        return this.menuService.getDishesByRestaurant(id);
    }
    
    @Post('addMenu/:resId')
    addMenu(@Req() req:any,@Param('resId') id:any,@Body() addMenu:AddMenuDto)
    {
        this.logger.verbose('adding to menu')
        return this.menuService.AddMenu(req.user,id,addMenu);
    }
}

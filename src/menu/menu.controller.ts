import { Controller, Logger, Get, Param, ParseIntPipe, Post, Body, Req, Put, UseGuards } from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { AddMenuDto, UpdateDish } from './dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Menu Management')
@Controller('api/v1/menu')
export class MenuController {
    private logger =new  Logger('Restaurant Controller');
    constructor(private readonly menuService: MenuService){}

    @Get('menu/:resId')
    getMenuById(@Param('resId') id:string)
    {
        this.logger.verbose("retrieving Menu")
        console.log(id)
        return this.menuService.getMenuById(id);
    }

    @Get('dishes/:menuId')
    getDishesByMenuId(@Param('menuId') id:string)
    {
        this.logger.verbose('retrieving dishes by menu')
        return this.menuService.getDishesByMenu(id);
    }

    @Get('resdishes/:resId')
    getDishesByRestaurantId(@Param('resId') id:string)
    {
        this.logger.verbose('retrieving dishes by restaurant Id')
        console.log(id);
        return this.menuService.getDishesByRestaurant(id);
    }
    
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post(':resId')
    addMenu(@Param('resId')id:string,@Body() addMenu:AddMenuDto,@Req() req:any)
    {
        this.logger.verbose('adding to menu')
        return this.menuService.AddMenu(id,addMenu,req.user);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put('updateDish')
    updateDish(@Body() updateDish:UpdateDish,@Req() req:any)
    {
        this.logger.verbose('updating dish')
        return this.menuService.UpdateDish(updateDish,req.user);
    }

    
}

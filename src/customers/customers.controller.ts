import { Controller, Logger, UseGuards, Post, Req, Body, Get, Query, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { AuthGuard } from '@nestjs/passport';
import { AddCustomerDto, UpdateCustomerDto, AddLoyalityPoints } from './dto';

@ApiTags("Customer Managment")
@Controller("api/v1/customer")
export class CustomersController {
    private logger = new Logger("Customer Controller");
    constructor(
        private readonly customerService:CustomersService
    ){}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('allCustomers')
    getAllCustomers(@Req() req:any){
        this.logger.verbose("Get All Customers");
        return this.customerService.getAllCustomers(req.user);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('addCustomer')
    addCustomer(@Req() req:any,@Body() addCustomerDto:AddCustomerDto){
        this.logger.verbose("Adding Customer");
        return this.customerService.addCustomer(req.user,addCustomerDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('customerDetails')
    getCustomers(@Req() req:any)
    {
        this.logger.verbose("Retreiving Customer");
        console.log(req.user);
        return this.customerService.getCustomer(req.user);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('updateCustomerDetails/:id')
    updateCustomer(@Req() req:any,@Param('id') id: string,@Body() updateCustomerDto:UpdateCustomerDto){
        this.logger.verbose("Updating Customer");
        return this.customerService.updateCustomer(req.user,id,updateCustomerDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete('deleteCustomerDetails/:custId')
    deleteCustomer(@Req() req:any,@Param('custId') id:string){
        this.logger.verbose('Delete Customer')
        return this.customerService.deleteCustomer(req.user,id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('addLoyalityPoints/:custId')
    addLoyalityPoints(@Req() req:any,@Param('custId') id:string,@Body() addLoyalityPoints:AddLoyalityPoints)
    {
        this.logger.verbose('Add Loyality Points to Customer')
        return this.customerService.addLoyalityPoints(req.user,id,addLoyalityPoints);
    }
}

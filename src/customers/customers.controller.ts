import { Controller, Logger, UseGuards, Post, Req, Body, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { AuthGuard } from '@nestjs/passport';
import { AddCustomerDto } from './dto';

@ApiTags("Customer Managment")
@Controller("api/v1/customer")
export class CustomersController {
    private logger = new Logger("Customer Controller");
    constructor(
        private readonly customerService:CustomersService
    ){}

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
}

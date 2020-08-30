import { EntityRepository, MongoRepository } from "typeorm";;
import { Booking } from "./entities/Booking.entity";
import { CreateBookingDto } from "./dto";
import { User } from "src/auth/entities/User.entity";
import { MenuRepository } from "src/menu/menu.repository";
const ObjectId = require('mongodb').ObjectID;

@EntityRepository(Booking)
export class BookingRepository extends MongoRepository<Booking>{
    async createBooking(user: User, data: CreateBookingDto,repo:MenuRepository):Promise<any> {
        console.log(user)
        const {dishIds,qty,restaurantId,deliveryAdd,deliveryDate}=data;
        const booking = new Booking()
        booking.restaurantId=restaurantId
        booking.userId=user.id.toString()
        if(deliveryAdd)
        {
            booking.deliveryAdd=deliveryAdd
        }
        else
        {
            booking.deliveryAdd=user.location.toString()
        }
        booking.updatedAt=new Date()
        booking.cancelStatus='Pending'
        booking.deliveryDate=deliveryDate
        booking.createdAt=new Date()
        const menu = await repo.find({restaurantId:restaurantId})
        
        if(menu.length>0)
        {
            for(var i=0;i<dishIds.length;i++)
            {
                for (var j=0;j<menu.length;j++)
                {
                    for (var z=0;menu[j].dishes.length;z++)
                    {
                        if(ObjectId(dishIds[i])==menu[j].dishes[z].id)
                        {
                            booking.dish.append(menu[j].dishes[z],qty[i]);
                            booking.totalAmount+=qty[i]*menu[j].dishes[z].price;
                            
                        }
                    }
                }
            }
            booking.payStatus="Pending";
            booking.paymentDetail=null;
            booking.deliveryId=null;
            booking.deliveryStatus="Pending";
        }
    }
}
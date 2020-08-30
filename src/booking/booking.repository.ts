import { EntityRepository, MongoRepository } from 'typeorm';
import { Booking } from './entities/Booking.entity';
import { CreateBookingDto } from './dto';
import { User } from 'src/auth/entities/User.entity';
import { MenuRepository } from 'src/menu/menu.repository';
const ObjectId = require('mongodb').ObjectID;

@EntityRepository(Booking)
export class BookingRepository extends MongoRepository<Booking> {
  async createBooking(
    user: User,
    data: CreateBookingDto,
    repo: MenuRepository,
  ): Promise<any> {
    console.log(user);
    const { dishIds, qty, restaurantId, deliveryAdd, deliveryDate } = data;
    const booking = new Booking();
    booking.restaurantId = restaurantId;
    booking.userId = user.id.toString();
    if (deliveryAdd) {
      booking.deliveryAdd = deliveryAdd;
    } else {
      booking.deliveryAdd = 'Ernakulam';
    }
    booking.updatedAt = new Date();
    booking.cancelStatus = 'Pending';
    booking.deliveryDate = deliveryDate;
    booking.createdAt = new Date();
    const menu = await repo.find({ restaurantId: restaurantId });
    booking.dish = [];
    booking.totalAmount = 0;
    if (menu.length > 0) {
      for (var i = 0; i < dishIds.length; i++) {
        for (var j = 0; j < menu.length; j++) {
          for (var z = 0; z < menu[j].dishes.length; z++) {
            if (dishIds[i] == menu[j].dishes[z].dishId) {
              menu[j].dishes[z]['quantity'] = qty[i];
              booking.dish.push(menu[j].dishes[z]);
              booking.totalAmount += qty[i] * menu[j].dishes[z].price;
            }
          }
        }
      }
      booking.payStatus = 'Pending';
      booking.paymentDetail = null;
      booking.deliveryId = null;
      booking.deliveryStatus = 'Pending';
      await this.save(booking);
      return booking;
    } else {
      return 'no menu';
    }
  }
}

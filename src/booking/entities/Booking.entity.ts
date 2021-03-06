import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';
import { isArray } from 'util';

@Entity('booking')
export class Booking {
  @ObjectIdColumn()
  bookId: ObjectID;

  @Column()
  dish: any;

  @Column()
  restaurantId: any;

  @Column()
  userId: any;

  @Column({ length: 128 })
  deliveryStatus: string;

  @Column({ length: 128 })
  cancelStatus: string;

  @Column({ length: 128 })
  paymentDetail: string;

  @Column({ length: 128 })
  payStatus: string;

  @Column()
  deliveryDate: Date;

  @Column({ length: 128 })
  deliveryAdd: any;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @ObjectIdColumn()
  deliveryId: ObjectID;

  @Column({ default: 0 })
  totalAmount: number;

  constructor(booking?: Partial<Booking>) {
    Object.assign(this, booking);
  }
}

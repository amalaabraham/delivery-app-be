import {
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ObjectIdColumn,
    ObjectID,
  } from 'typeorm';
  
  @Entity('customer')
  @Unique(['email'])
  export class Customer {
    @ObjectIdColumn()
    id: ObjectID;
  
    @Column()
    resId: any;
    @Column({ length: 128 })
    name: string;
  
    @Column({ length: 128 })
    email: string;
  
    @Column({ nullable: true })
    contact: number;
  
  
    constructor(customer?: Partial<Customer>) {
      Object.assign(this, customer);
    }
  }
  
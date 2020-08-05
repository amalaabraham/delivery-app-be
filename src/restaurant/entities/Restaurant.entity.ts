import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ObjectIdColumn, ObjectID } from "typeorm";


@Entity('restaurant')
export class Restaurant {

  @PrimaryGeneratedColumn() 
  id: ObjectID;

  @Column()
  ownerID: any;

  @Column({ length: 128 })
  name: string;

  @Column({ length: 256 })
  address: string;

  @Column({ nullable: true })
  contact: number;

  @Column({ type:'jsonb', nullable:true })
  menulist: any;

  @Column({ type:'jsonb', nullable:true })
  photos: any;

  @Column({ length: 128 })
  status: string;
  
  @Column({ nullable: true })
  location: number;

  @Column({ nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;


  constructor(restaurant?: Partial<Restaurant>) {
    Object.assign(this, restaurant);
  }

}
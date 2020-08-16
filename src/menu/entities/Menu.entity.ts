import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";

@Entity('menu')
export class Menu{
    @ObjectIdColumn()
    id:ObjectId;

    @Column()
    restaurantId:any;

    @Column()
    name:string;

    @Column()
    dishes:any;

}
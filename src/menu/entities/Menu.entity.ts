import { Entity, ObjectIdColumn, Column,ObjectID } from "typeorm";
//import { ObjectId } from "mongodb";

@Entity('menu')
export class Menu{
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    restaurantId:any;

    @Column()
    name:string;

    @Column()
    dishes:any;

    constructor(menu?: Partial<Menu>) {
        Object.assign(this, menu);
      }

}
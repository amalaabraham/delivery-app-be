import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ length: 128 })
  name: string;

  @Column({ length: 128 })
  email: string;

  @Column({ length: 128 })
  password: string;

  @Column({ length: 128 })
  type: string;

  @Column({ length: 128 })
  status: string;

  @Column({ nullable: true })
  number: number;

  @Column({ nullable: true })
  location: number;

  @Column({ nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}

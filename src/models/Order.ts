import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IOrder } from '../types/entities';
import { User } from './User';
import { OrderItem } from './OrderItem';

@Entity('orders')
export class Order implements IOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  })
  status: 'pending' | 'processing' | 'completed' | 'cancelled';

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

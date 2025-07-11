import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Order } from '../models/Order';

export class OrderRepository extends Repository<Order> {
  constructor() {
    super(Order, AppDataSource.createEntityManager());
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.product']
    });
  }

  async findOrderWithItems(orderId: number): Promise<Order | null> {
    return this.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product']
    });
  }
}

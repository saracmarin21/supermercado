import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { OrderItem } from '../models/OrderItem';

export class OrderItemRepository extends Repository<OrderItem> {
  constructor() {
    super(OrderItem, AppDataSource.createEntityManager());
  }
}

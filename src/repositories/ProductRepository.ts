import { Repository, Between } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Product } from '../models/Product';

export class ProductRepository extends Repository<Product> {
  constructor() {
    super(Product, AppDataSource.createEntityManager());
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.find({ where: { category } });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.find({
      where: {
        price: Between(minPrice, maxPrice)
      }
    });
  }

  async updateStock(productId: number, quantity: number): Promise<void> {
    await this.update(
      { id: productId },
      { stock: () => `stock + ${quantity}` }
    );
  }
}

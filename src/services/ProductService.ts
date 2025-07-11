import { Product } from '../models/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, productData);
    const updatedProduct = await this.productRepository.findOne({ where: { id } });
    if (!updatedProduct) {
      throw new Error('Producto no encontrado');
    }
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Producto no encontrado');
    }
  }
}

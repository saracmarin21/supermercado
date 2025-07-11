import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getAllProducts(_req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.getProductById(Number(req.params.id));
      if (!product) {
        res.status(404).json({ message: 'Producto no encontrado' });
        return;
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getProductsByCategory(req.params.category);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.updateProduct(Number(req.params.id), req.body);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      await this.productService.deleteProduct(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const ProductRepository_1 = require("../repositories/ProductRepository");
class ProductService {
    constructor() {
        this.productRepository = new ProductRepository_1.ProductRepository();
    }
    async getAllProducts() {
        return this.productRepository.find();
    }
    async getProductById(id) {
        return this.productRepository.findOne({ where: { id } });
    }
    async getProductsByCategory(category) {
        return this.productRepository.findByCategory(category);
    }
    async createProduct(productData) {
        const product = this.productRepository.create(productData);
        return this.productRepository.save(product);
    }
    async updateProduct(id, productData) {
        await this.productRepository.update(id, productData);
        const updatedProduct = await this.productRepository.findOne({ where: { id } });
        if (!updatedProduct) {
            throw new Error('Producto no encontrado');
        }
        return updatedProduct;
    }
    async deleteProduct(id) {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Producto no encontrado');
        }
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map
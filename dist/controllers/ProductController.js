"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
class ProductController {
    constructor() {
        this.productService = new ProductService_1.ProductService();
    }
    async getAllProducts(_req, res) {
        try {
            const products = await this.productService.getAllProducts();
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getProductById(req, res) {
        try {
            const product = await this.productService.getProductById(Number(req.params.id));
            if (!product) {
                res.status(404).json({ message: 'Producto no encontrado' });
                return;
            }
            res.json(product);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getProductsByCategory(req, res) {
        try {
            const products = await this.productService.getProductsByCategory(req.params.category);
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async createProduct(req, res) {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updateProduct(req, res) {
        try {
            const product = await this.productService.updateProduct(Number(req.params.id), req.body);
            res.json(product);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteProduct(req, res) {
        try {
            await this.productService.deleteProduct(Number(req.params.id));
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map
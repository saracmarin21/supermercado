"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const Product_1 = require("../models/Product");
class ProductRepository extends typeorm_1.Repository {
    constructor() {
        super(Product_1.Product, database_1.AppDataSource.createEntityManager());
    }
    async findByCategory(category) {
        return this.find({ where: { category } });
    }
    async findByPriceRange(minPrice, maxPrice) {
        return this.find({
            where: {
                price: (0, typeorm_1.Between)(minPrice, maxPrice)
            }
        });
    }
    async updateStock(productId, quantity) {
        await this.update({ id: productId }, { stock: () => `stock + ${quantity}` });
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map
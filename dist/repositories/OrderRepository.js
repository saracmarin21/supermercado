"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const Order_1 = require("../models/Order");
class OrderRepository extends typeorm_1.Repository {
    constructor() {
        super(Order_1.Order, database_1.AppDataSource.createEntityManager());
    }
    async findByUserId(userId) {
        return this.find({
            where: { userId },
            relations: ['orderItems', 'orderItems.product']
        });
    }
    async findOrderWithItems(orderId) {
        return this.findOne({
            where: { id: orderId },
            relations: ['orderItems', 'orderItems.product']
        });
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=OrderRepository.js.map
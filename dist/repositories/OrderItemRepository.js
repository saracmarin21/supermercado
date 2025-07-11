"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemRepository = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const OrderItem_1 = require("../models/OrderItem");
class OrderItemRepository extends typeorm_1.Repository {
    constructor() {
        super(OrderItem_1.OrderItem, database_1.AppDataSource.createEntityManager());
    }
}
exports.OrderItemRepository = OrderItemRepository;
//# sourceMappingURL=OrderItemRepository.js.map
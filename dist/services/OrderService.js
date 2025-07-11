"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const OrderRepository_1 = require("../repositories/OrderRepository");
const OrderItemRepository_1 = require("../repositories/OrderItemRepository");
const ProductRepository_1 = require("../repositories/ProductRepository");
class OrderService {
    constructor() {
        this.orderRepository = new OrderRepository_1.OrderRepository();
        this.productRepository = new ProductRepository_1.ProductRepository();
        this.orderItemRepository = new OrderItemRepository_1.OrderItemRepository();
    }
    async createOrder(userId, items) {
        let total = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await this.productRepository.findOne({ where: { id: item.productId } });
            if (!product) {
                throw new Error(`Producto ${item.productId} no encontrado`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Stock insuficiente para el producto ${product.name}`);
            }
            total += product.price * item.quantity;
            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price
            });
            await this.productRepository.updateStock(product.id, -item.quantity);
        }
        const order = this.orderRepository.create({
            userId,
            total,
            status: 'pending'
        });
        const savedOrder = await this.orderRepository.save(order);
        const savedOrderItems = await Promise.all(orderItems.map(async (item) => {
            const orderItem = this.orderItemRepository.create({
                orderId: savedOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            });
            return this.orderItemRepository.save(orderItem);
        }));
        savedOrder.orderItems = savedOrderItems;
        return savedOrder;
    }
    async getOrderById(orderId) {
        return this.orderRepository.findOrderWithItems(orderId);
    }
    async getUserOrders(userId) {
        return this.orderRepository.findByUserId(userId);
    }
    async updateOrderStatus(orderId, status) {
        await this.orderRepository.update(orderId, { status });
        const updatedOrder = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!updatedOrder) {
            throw new Error('Orden no encontrada');
        }
        return updatedOrder;
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map
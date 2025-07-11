"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const OrderService_1 = require("../services/OrderService");
class OrderController {
    constructor() {
        this.orderService = new OrderService_1.OrderService();
    }
    async createOrder(req, res) {
        try {
            const { items } = req.body;
            const userId = req.user.userId;
            const order = await this.orderService.createOrder(userId, items);
            res.status(201).json(order);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getOrderById(req, res) {
        try {
            const order = await this.orderService.getOrderById(Number(req.params.id));
            if (!order) {
                res.status(404).json({ message: 'Orden no encontrada' });
                return;
            }
            res.json(order);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getUserOrders(req, res) {
        try {
            const userId = req.user.userId;
            const orders = await this.orderService.getUserOrders(userId);
            res.json(orders);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async updateOrderStatus(req, res) {
        try {
            const { status } = req.body;
            const order = await this.orderService.updateOrderStatus(Number(req.params.id), status);
            res.json(order);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=OrderController.js.map
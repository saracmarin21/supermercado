"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const orderController = new OrderController_1.OrderController();
router.use(auth_1.authMiddleware);
router.post('/', async (req, res) => {
    await orderController.createOrder(req, res);
});
router.get('/my-orders', async (req, res) => {
    await orderController.getUserOrders(req, res);
});
router.get('/:id', async (req, res) => {
    await orderController.getOrderById(req, res);
});
router.put('/:id/status', (0, auth_1.checkRole)(['admin']), async (req, res) => {
    await orderController.updateOrderStatus(req, res);
});
exports.default = router;
//# sourceMappingURL=order.routes.js.map
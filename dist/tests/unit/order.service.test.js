"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrderService_1 = require("../../services/OrderService");
const OrderRepository_1 = require("../../repositories/OrderRepository");
const OrderItemRepository_1 = require("../../repositories/OrderItemRepository");
const ProductRepository_1 = require("../../repositories/ProductRepository");
jest.mock('../../repositories/OrderRepository');
jest.mock('../../repositories/ProductRepository');
jest.mock('../../repositories/OrderItemRepository');
describe('OrderService', () => {
    let orderService;
    let mockOrderRepository;
    let mockProductRepository;
    let mockOrderItemRepository;
    beforeEach(() => {
        jest.clearAllMocks();
        mockOrderRepository = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            findByUserId: jest.fn(),
            findOrderWithItems: jest.fn()
        };
        mockProductRepository = {
            findOne: jest.fn(),
            updateStock: jest.fn()
        };
        mockOrderItemRepository = {
            create: jest.fn(),
            save: jest.fn()
        };
        OrderRepository_1.OrderRepository.mockImplementation(() => mockOrderRepository);
        ProductRepository_1.ProductRepository.mockImplementation(() => mockProductRepository);
        OrderItemRepository_1.OrderItemRepository.mockImplementation(() => mockOrderItemRepository);
        orderService = new OrderService_1.OrderService();
    });
    describe('createOrder', () => {
        it('should create a new order successfully', async () => {
            const userId = 1;
            const items = [
                { productId: 1, quantity: 2 }
            ];
            const mockProduct = {
                id: 1,
                name: 'Test Product',
                description: 'Test Description',
                price: 10,
                stock: 5,
                category: 'Test',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const mockOrder = {
                id: 1,
                userId,
                user: {},
                total: 20,
                status: 'pending',
                orderItems: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockProductRepository.findOne.mockResolvedValue(mockProduct);
            mockOrderRepository.create.mockReturnValue(mockOrder);
            mockOrderRepository.save.mockResolvedValue(mockOrder);
            mockProductRepository.updateStock.mockResolvedValue(undefined);
            const result = await orderService.createOrder(userId, items);
            expect(result).toEqual(mockOrder);
            expect(mockProductRepository.updateStock).toHaveBeenCalledWith(1, -2);
        });
        it('should throw error if product not found', async () => {
            const userId = 1;
            const items = [{ productId: 999, quantity: 1 }];
            mockProductRepository.findOne.mockResolvedValue(null);
            await expect(orderService.createOrder(userId, items))
                .rejects.toThrow('Producto 999 no encontrado');
        });
        it('should throw error if insufficient stock', async () => {
            const userId = 1;
            const items = [{ productId: 1, quantity: 10 }];
            const mockProduct = {
                id: 1,
                name: 'Test Product',
                description: 'Test Description',
                price: 10,
                stock: 5,
                category: 'Test',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockProductRepository.findOne.mockResolvedValue(mockProduct);
            await expect(orderService.createOrder(userId, items))
                .rejects.toThrow('Stock insuficiente para el producto Test Product');
        });
    });
    describe('getUserOrders', () => {
        it('should return user orders', async () => {
            const userId = 1;
            const mockOrders = [
                {
                    id: 1,
                    userId,
                    user: {},
                    total: 20,
                    status: 'pending',
                    orderItems: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            mockOrderRepository.findByUserId.mockResolvedValue(mockOrders);
            const result = await orderService.getUserOrders(userId);
            expect(result).toEqual(mockOrders);
            expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(userId);
        });
    });
    describe('updateOrderStatus', () => {
        it('should update order status', async () => {
            const orderId = 1;
            const newStatus = 'completed';
            const mockOrder = {
                id: orderId,
                userId: 1,
                user: {},
                total: 20,
                status: newStatus,
                orderItems: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const updateResult = {
                affected: 1,
                raw: {},
                generatedMaps: []
            };
            mockOrderRepository.update.mockResolvedValue(updateResult);
            mockOrderRepository.findOne.mockResolvedValue(mockOrder);
            const result = await orderService.updateOrderStatus(orderId, newStatus);
            expect(result).toEqual(mockOrder);
            expect(mockOrderRepository.update).toHaveBeenCalledWith(orderId, { status: newStatus });
        });
        it('should throw error if order not found', async () => {
            const orderId = 999;
            const newStatus = 'completed';
            mockOrderRepository.findOne.mockResolvedValue(null);
            await expect(orderService.updateOrderStatus(orderId, newStatus))
                .rejects.toThrow('Orden no encontrada');
        });
    });
});
//# sourceMappingURL=order.service.test.js.map
import { OrderService } from '../../services/OrderService';
import { OrderRepository } from '../../repositories/OrderRepository';
import { OrderItemRepository } from '../../repositories/OrderItemRepository';
import { ProductRepository } from '../../repositories/ProductRepository';
import { Order } from '../../models/Order';
import { Product } from '../../models/Product';
import { User } from '../../models/User';
import { UpdateResult } from 'typeorm';

jest.mock('../../repositories/OrderRepository');
jest.mock('../../repositories/ProductRepository');
jest.mock('../../repositories/OrderItemRepository');

describe('OrderService', () => {
  let orderService: OrderService;
  let mockOrderRepository: Partial<OrderRepository>;
  let mockProductRepository: Partial<ProductRepository>;
  let mockOrderItemRepository: Partial<OrderItemRepository>;

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

    // Configurar los mocks
    (OrderRepository as jest.MockedClass<typeof OrderRepository>).mockImplementation(() => mockOrderRepository as OrderRepository);
    (ProductRepository as jest.MockedClass<typeof ProductRepository>).mockImplementation(() => mockProductRepository as ProductRepository);
    (OrderItemRepository as jest.MockedClass<typeof OrderItemRepository>).mockImplementation(() => mockOrderItemRepository as OrderItemRepository);

    orderService = new OrderService();
  });

  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
      const userId = 1;
      const items = [
        { productId: 1, quantity: 2 }
      ];

      const mockProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        stock: 5,
        category: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockOrder: Order = {
        id: 1,
        userId,
        user: {} as User,
        total: 20,
        status: 'pending',
        orderItems: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (mockProductRepository.findOne as jest.Mock).mockResolvedValue(mockProduct);
      (mockOrderRepository.create as jest.Mock).mockReturnValue(mockOrder);
      (mockOrderRepository.save as jest.Mock).mockResolvedValue(mockOrder);
      (mockProductRepository.updateStock as jest.Mock).mockResolvedValue(undefined);

      const result = await orderService.createOrder(userId, items);

      expect(result).toEqual(mockOrder);
      expect(mockProductRepository.updateStock).toHaveBeenCalledWith(1, -2);
    });

    it('should throw error if product not found', async () => {
      const userId = 1;
      const items = [{ productId: 999, quantity: 1 }];

      (mockProductRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(orderService.createOrder(userId, items))
        .rejects.toThrow('Producto 999 no encontrado');
    });

    it('should throw error if insufficient stock', async () => {
      const userId = 1;
      const items = [{ productId: 1, quantity: 10 }];

      const mockProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        stock: 5,
        category: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (mockProductRepository.findOne as jest.Mock).mockResolvedValue(mockProduct);

      await expect(orderService.createOrder(userId, items))
        .rejects.toThrow('Stock insuficiente para el producto Test Product');
    });
  });

  describe('getUserOrders', () => {
    it('should return user orders', async () => {
      const userId = 1;
      const mockOrders: Order[] = [
        {
          id: 1,
          userId,
          user: {} as User,
          total: 20,
          status: 'pending',
          orderItems: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (mockOrderRepository.findByUserId as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderService.getUserOrders(userId);

      expect(result).toEqual(mockOrders);
      expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const orderId = 1;
      const newStatus = 'completed' as const;
      const mockOrder: Order = {
        id: orderId,
        userId: 1,
        user: {} as User,
        total: 20,
        status: newStatus,
        orderItems: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: []
      };

      (mockOrderRepository.update as jest.Mock).mockResolvedValue(updateResult);
      (mockOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.updateOrderStatus(orderId, newStatus);

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(orderId, { status: newStatus });
    });

    it('should throw error if order not found', async () => {
      const orderId = 999;
      const newStatus = 'completed' as const;

      (mockOrderRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(orderService.updateOrderStatus(orderId, newStatus))
        .rejects.toThrow('Orden no encontrada');
    });
  });
});

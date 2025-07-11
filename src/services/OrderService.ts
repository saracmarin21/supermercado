import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { OrderRepository } from '../repositories/OrderRepository';
import { OrderItemRepository } from '../repositories/OrderItemRepository';
import { ProductRepository } from '../repositories/ProductRepository';

export class OrderService {
  private orderRepository: OrderRepository;
  private productRepository: ProductRepository;
  private orderItemRepository: OrderItemRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
    this.orderItemRepository = new OrderItemRepository();
  }

  async createOrder(userId: number, items: Array<{ productId: number; quantity: number }>): Promise<Order> {
    let total = 0;
    const orderItems: OrderItem[] = [];

    // Verificar stock y calcular total
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
      } as OrderItem);

      // Actualizar stock
      await this.productRepository.updateStock(product.id, -item.quantity);
    }

    // Crear orden
    const order = this.orderRepository.create({
      userId,
      total,
      status: 'pending'
    });

    // Guardar la orden
    const savedOrder = await this.orderRepository.save(order);

    // Crear y guardar los items de la orden
    const savedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const orderItem = this.orderItemRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
        return this.orderItemRepository.save(orderItem);
      })
    );

    savedOrder.orderItems = savedOrderItems;
    return savedOrder;
  }

  async getOrderById(orderId: number): Promise<Order | null> {
    return this.orderRepository.findOrderWithItems(orderId);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async updateOrderStatus(orderId: number, status: Order['status']): Promise<Order> {
    await this.orderRepository.update(orderId, { status });
    const updatedOrder = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!updatedOrder) {
      throw new Error('Orden no encontrada');
    }
    return updatedOrder;
  }
}

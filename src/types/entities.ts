export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  id: number;
  userId: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

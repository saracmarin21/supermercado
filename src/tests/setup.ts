import 'reflect-metadata';
import dotenv from 'dotenv';

// Configurar variables de entorno para pruebas
dotenv.config({ path: '.env.test' });

// Configuración global de Jest
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock de TypeORM
jest.mock('../config/database', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(true),
    createEntityManager: jest.fn()
  }
}));

// Mock de bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_token'),
  verify: jest.fn().mockReturnValue({ userId: 1, email: 'test@test.com' })
}));

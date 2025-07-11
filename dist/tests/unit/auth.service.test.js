"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = require("../../services/AuthService");
const UserRepository_1 = require("../../repositories/UserRepository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('AuthService', () => {
    let authService;
    let mockUserRepository;
    beforeEach(() => {
        jest.clearAllMocks();
        mockUserRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            save: jest.fn()
        };
        jest.spyOn(UserRepository_1.UserRepository.prototype, 'findByEmail').mockImplementation(mockUserRepository.findByEmail);
        jest.spyOn(UserRepository_1.UserRepository.prototype, 'create').mockImplementation(mockUserRepository.create);
        jest.spyOn(UserRepository_1.UserRepository.prototype, 'save').mockImplementation(mockUserRepository.save);
        authService = new AuthService_1.AuthService();
    });
    describe('registerUser', () => {
        it('should successfully register a new user', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
                role: 'customer'
            };
            const hashedPassword = 'hashedPassword';
            bcryptjs_1.default.hash.mockResolvedValue(hashedPassword);
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue({ ...userData, password: hashedPassword });
            mockUserRepository.save.mockResolvedValue({ id: 1, ...userData, password: hashedPassword });
            const result = await authService.registerUser(userData);
            expect(result).toHaveProperty('id');
            expect(result.email).toBe(userData.email);
            expect(bcryptjs_1.default.hash).toHaveBeenCalledWith(userData.password, 10);
        });
        it('should throw error if user already exists', async () => {
            const userData = {
                email: 'existing@test.com',
                password: 'password123'
            };
            mockUserRepository.findByEmail.mockResolvedValue({ id: 1, ...userData });
            await expect(authService.registerUser(userData)).rejects.toThrow('El usuario ya existe');
        });
    });
    describe('login', () => {
        it('should successfully login a user', async () => {
            const userData = {
                id: 1,
                email: 'test@test.com',
                password: 'hashedPassword',
                role: 'customer'
            };
            const token = 'jwt-token';
            mockUserRepository.findByEmail.mockResolvedValue(userData);
            bcryptjs_1.default.compare.mockResolvedValue(true);
            jsonwebtoken_1.default.sign.mockReturnValue(token);
            const result = await authService.login('test@test.com', 'password123');
            expect(result).toHaveProperty('token', token);
            expect(result.user).toHaveProperty('email', userData.email);
            expect(result.user).not.toHaveProperty('password');
        });
        it('should throw error if user not found', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            await expect(authService.login('nonexistent@test.com', 'password123'))
                .rejects.toThrow('Usuario no encontrado');
        });
        it('should throw error if password is incorrect', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'hashedPassword'
            };
            mockUserRepository.findByEmail.mockResolvedValue(userData);
            bcryptjs_1.default.compare.mockResolvedValue(false);
            await expect(authService.login('test@test.com', 'wrongpassword'))
                .rejects.toThrow('Contraseña incorrecta');
        });
    });
});
//# sourceMappingURL=auth.service.test.js.map
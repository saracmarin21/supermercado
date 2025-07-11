"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repositories/UserRepository");
class AuthService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    async registerUser(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword
        });
        return this.userRepository.save(user);
    }
    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Contraseña incorrecta');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    constructor() {
        this.authService = new AuthService_1.AuthService();
    }
    async register(req, res) {
        try {
            const user = await this.authService.registerUser(req.body);
            const { password: _, ...userWithoutPassword } = user;
            res.status(201).json(userWithoutPassword);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token no proporcionado' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
exports.authMiddleware = authMiddleware;
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'No tienes permisos suficientes' });
            return;
        }
        next();
    };
};
exports.checkRole = checkRole;
//# sourceMappingURL=auth.js.map
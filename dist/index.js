"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.json({ message: 'Bienvenido a la API del E-commerce de Supermercado' });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});
const PORT = process.env.PORT || 3000;
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Base de datos conectada exitosamente');
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
})
    .catch((error) => console.log('Error al conectar a la base de datos:', error));
//# sourceMappingURL=index.js.map
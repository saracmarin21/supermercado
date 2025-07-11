"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const productController = new ProductController_1.ProductController();
router.get('/', async (req, res) => {
    await productController.getAllProducts(req, res);
});
router.get('/:id', async (req, res) => {
    await productController.getProductById(req, res);
});
router.get('/category/:category', async (req, res) => {
    await productController.getProductsByCategory(req, res);
});
router.use(auth_1.authMiddleware);
router.use((0, auth_1.checkRole)(['admin']));
router.post('/', async (req, res) => {
    await productController.createProduct(req, res);
});
router.put('/:id', async (req, res) => {
    await productController.updateProduct(req, res);
});
router.delete('/:id', async (req, res) => {
    await productController.deleteProduct(req, res);
});
exports.default = router;
//# sourceMappingURL=product.routes.js.map
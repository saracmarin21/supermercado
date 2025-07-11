import { Router, Request, Response, RequestHandler } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware, checkRole } from '../middlewares/auth';

const router = Router();
const productController = new ProductController();

// Rutas públicas
router.get('/', async (req: Request, res: Response) => {
  await productController.getAllProducts(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await productController.getProductById(req, res);
});

router.get('/category/:category', async (req: Request, res: Response) => {
  await productController.getProductsByCategory(req, res);
});

// Rutas protegidas (solo admin)
router.use(authMiddleware as RequestHandler);
router.use(checkRole(['admin']) as RequestHandler);

router.post('/', async (req: Request, res: Response) => {
  await productController.createProduct(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await productController.updateProduct(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await productController.deleteProduct(req, res);
});

export default router;

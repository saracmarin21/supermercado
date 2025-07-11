import { Router, Request, Response, RequestHandler } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware, checkRole } from '../middlewares/auth';

const router = Router();
const orderController = new OrderController();

// Todas las rutas requieren autenticación
router.use(authMiddleware as RequestHandler);

// Rutas para clientes
router.post('/', async (req: Request, res: Response) => {
    await orderController.createOrder(req, res);
});

router.get('/my-orders', async (req: Request, res: Response) => {
    await orderController.getUserOrders(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
    await orderController.getOrderById(req, res);
});

// Rutas solo para admin
router.put('/:id/status', 
    checkRole(['admin']) as RequestHandler,
    async (req: Request, res: Response) => {
        await orderController.updateOrderStatus(req, res);
    }
);

export default router;

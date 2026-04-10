import { Router } from 'express';
import routeController from '../controllers/route.controller';

const router = Router();

router.post('/optimize-routes', routeController.optimizeRoutes);
router.post('/', routeController.create);
router.get('/', routeController.getAll);
router.get('/:id', routeController.getById);
router.put('/:id', routeController.update);
router.delete('/:id', routeController.delete);

export default router;

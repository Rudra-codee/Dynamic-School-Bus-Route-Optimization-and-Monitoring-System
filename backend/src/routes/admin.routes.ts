import { Router } from 'express';
import adminController from '../controllers/admin.controller';

const router = Router();

router.get('/metrics', adminController.getMetrics);
router.get('/fleet', adminController.getFleet);
router.get('/alerts', adminController.getAlerts);

export default router;

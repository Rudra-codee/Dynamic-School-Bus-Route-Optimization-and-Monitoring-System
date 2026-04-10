import { Router } from 'express';
import { getHealthStatus } from '../controllers/health.controller';
import userRoutes from './user.routes';
import busRoutes from './bus.routes';
import routeRoutes from './route.routes';
import trackingRoutes from './tracking.routes';
import boardingRoutes from './boarding.routes';
import attendanceRoutes from './attendance.routes';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';

const router = Router();

// Health Check Route
router.get('/health', getHealthStatus);

// Resource Routes
router.use('/users', userRoutes);
router.use('/buses', busRoutes);
router.use('/routes', routeRoutes);
router.use('/tracking', trackingRoutes);
router.use('/boarding', boardingRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

export default router;

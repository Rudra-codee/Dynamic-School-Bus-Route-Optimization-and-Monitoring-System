import { Router } from 'express';
import { getHealthStatus } from '../controllers/health.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';
import userRoutes from './user.routes';
import busRoutes from './bus.routes';
import routeRoutes from './route.routes';
import trackingRoutes from './tracking.routes';
import boardingRoutes from './boarding.routes';
import attendanceRoutes from './attendance.routes';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';

const router = Router();

// ── Public Routes ──
router.get('/health', getHealthStatus);
router.use('/auth', authRoutes);

// ── Protected Routes (require JWT) ──
router.use('/users', protect, userRoutes);
router.use('/buses', protect, busRoutes);
router.use('/routes', protect, routeRoutes);
router.use('/tracking', protect, trackingRoutes);
router.use('/boarding', protect, boardingRoutes);
router.use('/attendance', protect, attendanceRoutes);
router.use('/students', protect, studentRoutes);

// ── Admin-Only Routes ──
router.use('/admin', protect, restrictTo(UserRole.ADMIN), adminRoutes);

export default router;

import { Router } from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller';

const router = Router();

router.post('/mark', markAttendance);
router.get('/:studentId', getAttendance);

export default router;

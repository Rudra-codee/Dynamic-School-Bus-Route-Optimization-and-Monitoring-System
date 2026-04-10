import { Router } from 'express';
import { markBoardingStatus, getBoardingStatus } from '../controllers/boarding.controller';

const router = Router();

router.post('/mark', markBoardingStatus);
router.get('/:busId', getBoardingStatus);

export default router;

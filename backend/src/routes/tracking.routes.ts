import { Router } from 'express';
import { updateLocation, getLatestLocation } from '../controllers/tracking.controller';

const router = Router();

router.post('/update-location', updateLocation);
router.get('/:busId', getLatestLocation);

export default router;

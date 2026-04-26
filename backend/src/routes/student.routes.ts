import { Router } from 'express';
import studentController from '../controllers/student.controller';

const router = Router();

router.post('/', studentController.create);
router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.delete);

// Parent-specific: get children by parent ID
router.get('/parent/:parentId', studentController.getByParent);

// Bus-specific: get students on a bus
router.get('/bus/:busId', studentController.getByBus);

// Bus assignment
router.post('/assign', studentController.assignToBus);
router.delete('/assign/:studentId', studentController.removeFromBus);

// Get bus for student
router.get('/:studentId/bus', studentController.getBusForStudent);

export default router;

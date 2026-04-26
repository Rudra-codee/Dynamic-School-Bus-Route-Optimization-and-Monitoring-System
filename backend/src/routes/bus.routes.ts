import { Router } from 'express';
import busController from '../controllers/bus.controller';

const router = Router();

// Driver: get my assigned bus
router.get('/my-bus', busController.getMyBus);

// Parent: get my child's bus
router.get('/my-child-bus', busController.getMyChildBus);

// CRUD
router.post('/', busController.create);
router.get('/', busController.getAll);
router.get('/:id', busController.getById);
router.get('/:id/students', busController.getStudents);
router.post('/:id/students', busController.addStudent);
router.put('/:id', busController.update);
router.delete('/:id', busController.delete);

export default router;

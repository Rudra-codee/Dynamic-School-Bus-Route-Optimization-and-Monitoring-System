import { Router } from 'express';
import busController from '../controllers/bus.controller';

const router = Router();

router.post('/', busController.create);
router.get('/', busController.getAll);
router.get('/:id', busController.getById);
router.get('/:id/students', busController.getStudents);
router.post('/:id/students', busController.addStudent);
router.put('/:id', busController.update);
router.delete('/:id', busController.delete);

export default router;

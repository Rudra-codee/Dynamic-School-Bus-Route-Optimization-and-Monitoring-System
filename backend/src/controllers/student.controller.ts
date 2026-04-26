import { Request, Response } from 'express';
import studentService from '../services/student.service';

class StudentController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json(student);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const students = await studentService.getAllStudents();
      res.status(200).json(students);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const student = await studentService.getStudentById(req.params.id as string);
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }
      res.status(200).json(student);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByParent(req: Request, res: Response): Promise<void> {
    try {
      const students = await studentService.getStudentsByParent(req.params.parentId as string);
      res.status(200).json(students);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByBus(req: Request, res: Response): Promise<void> {
    try {
      const students = await studentService.getStudentsByBus(req.params.busId as string);
      res.status(200).json(students);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async assignToBus(req: Request, res: Response): Promise<void> {
    try {
      const { studentId, busId, stopName } = req.body;
      if (!studentId || !busId) {
        res.status(400).json({ error: 'studentId and busId are required' });
        return;
      }
      const assignment = await studentService.assignStudentToBus(studentId, busId, stopName);
      res.status(200).json(assignment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeFromBus(req: Request, res: Response): Promise<void> {
    try {
      const result = await studentService.removeStudentFromBus(req.params.studentId as string);
      if (!result) {
        res.status(404).json({ message: 'Assignment not found' });
        return;
      }
      res.status(200).json({ message: 'Student removed from bus' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const student = await studentService.updateStudent(req.params.id as string, req.body);
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }
      res.status(200).json(student);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const student = await studentService.deleteStudent(req.params.id as string);
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }
      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBusForStudent(req: Request, res: Response): Promise<void> {
    try {
      const assignment = await studentService.getBusForStudent(req.params.studentId as string);
      if (!assignment) {
        res.status(404).json({ message: 'No bus assignment found for this student' });
        return;
      }
      res.status(200).json(assignment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new StudentController();

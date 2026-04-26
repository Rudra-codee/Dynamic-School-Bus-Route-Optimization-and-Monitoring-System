import { Request, Response } from 'express';
import busService from '../services/bus.service';
import studentService from '../services/student.service';

class BusController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const bus = await busService.createBus(req.body);
      res.status(201).json(bus);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const buses = await busService.getAllBuses();
      res.status(200).json(buses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const bus = await busService.getBusById(req.params.id as string);
      if (!bus) {
        res.status(404).json({ message: 'Bus not found' });
        return;
      }
      res.status(200).json(bus);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const bus = await busService.updateBus(req.params.id as string, req.body);
      if (!bus) {
         res.status(404).json({ message: 'Bus not found' });
         return;
      }
      res.status(200).json(bus);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const bus = await busService.deleteBus(req.params.id as string);
      if (!bus) {
        res.status(404).json({ message: 'Bus not found' });
        return;
      }
      res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const students = await busService.getStudentsForBus(req.params.id as string);
      res.status(200).json(students);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async addStudent(req: Request, res: Response): Promise<void> {
    try {
      const student = await busService.addStudentToBus(req.params.id as string, req.body);
      res.status(201).json(student);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get the bus assigned to the logged-in driver.
   * Used by the Driver Dashboard for dynamic bus resolution.
   */
  async getMyBus(req: Request, res: Response): Promise<void> {
    try {
      // @ts-ignore user attached by auth middleware
      const userId = req.user?._id?.toString() || req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }
      const bus = await busService.getBusForDriver(userId);
      if (!bus) {
        res.status(404).json({ message: 'No bus assigned to this driver' });
        return;
      }
      res.status(200).json(bus);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get the bus for the parent's child.
   * Finds the parent's children via Student model, then returns their bus assignment.
   */
  async getMyChildBus(req: Request, res: Response): Promise<void> {
    try {
      // @ts-ignore user attached by auth middleware
      const parentId = req.user?._id?.toString() || req.user?.id;
      if (!parentId) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      // Get parent's children
      const children = await studentService.getStudentsByParent(parentId);
      if (children.length === 0) {
        res.status(404).json({ message: 'No children found for this parent' });
        return;
      }

      // Get bus assignment for first child (or all)
      const results = [];
      for (const child of children) {
        const assignment = await studentService.getBusForStudent(child._id.toString());
        results.push({
          student: {
            id: child._id.toString(),
            name: child.name,
            email: child.email,
            location: child.location
          },
          busAssignment: assignment
        });
      }

      res.status(200).json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new BusController();

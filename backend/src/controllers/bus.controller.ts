import { Request, Response } from 'express';
import busService from '../services/bus.service';

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
}

export default new BusController();

import { Request, Response } from 'express';
import routeService from '../services/route.service';
import routeOptimizationEngine, { NearestNeighborStrategy, ClusterStrategy } from '../services/routeOptimization.service';
import User from '../models/user.model';
import Bus from '../models/bus.model';

class RouteController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const route = await routeService.createRoute(req.body);
      res.status(201).json(route);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const routes = await routeService.getAllRoutes();
      res.status(200).json(routes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const route = await routeService.getRouteById(req.params.id as string);
      if (!route) {
         res.status(404).json({ message: 'Route not found' });
         return;
      }
      res.status(200).json(route);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const route = await routeService.updateRoute(req.params.id as string, req.body);
      if (!route) {
         res.status(404).json({ message: 'Route not found' });
         return;
      }
      res.status(200).json(route);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const route = await routeService.deleteRoute(req.params.id as string);
      if (!route) {
         res.status(404).json({ message: 'Route not found' });
         return;
      }
      res.status(200).json({ message: 'Route deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async optimizeRoutes(req: Request, res: Response): Promise<void> {
    try {
      const strategyName = req.body.strategy || 'nearest';

      // Fetch all buses from DB
      const buses = await Bus.find({ status: 'active' }).lean();
      if (buses.length === 0) {
        res.status(200).json({ message: 'No active buses found', routes: [] });
        return;
      }

      // Fetch all students; seed with fake coords for demo
      const students = await User.find({ role: 'student' }).lean();
      if (students.length === 0) {
        res.status(200).json({ message: 'No students found', routes: [] });
        return;
      }

      // Map to StudentInput format with randomized mock coords for demo
      const studentInputs = students.map((s, i) => ({
        id: (s._id as any).toString(),
        name: s.name,
        present: true,
        location: {
          lat: 40.7128 + (i * 0.01),
          lng: -74.0060 + (i * 0.01)
        }
      }));

      // Map to BusInput format
      const busInputs = buses.map(b => ({
        id: (b._id as any).toString(),
        capacity: b.capacity
      }));

      // Dynamically select strategy
      if (strategyName === 'cluster') {
        routeOptimizationEngine.setStrategy(new ClusterStrategy());
      } else {
        routeOptimizationEngine.setStrategy(new NearestNeighborStrategy());
      }

      const result = routeOptimizationEngine.generateOptimizedRoute(studentInputs, busInputs);

      res.status(200).json({
        strategy: strategyName,
        routes: result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new RouteController();

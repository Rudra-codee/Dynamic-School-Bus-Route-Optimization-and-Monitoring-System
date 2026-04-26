import { Request, Response } from 'express';
import routeService from '../services/route.service';
import routeOptimizationEngine, { NearestNeighborStrategy, ClusterStrategy } from '../services/routeOptimization.service';
import TrafficSimulator from '../services/trafficSimulation.service';
import Student from '../models/student.model';
import Bus from '../models/bus.model';
import BusAssignment from '../models/busAssignment.model';
import Route from '../models/route.model';
import mongoose from 'mongoose';

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

  /**
   * Optimizes routes for all active buses using Student/BusAssignment data
   * and integrates traffic simulation for realistic scheduling.
   */
  async optimizeRoutes(req: Request, res: Response): Promise<void> {
    try {
      const strategyName = req.body.strategy || 'nearest';

      // Fetch all active buses
      const buses = await Bus.find({ status: 'active' }).lean();
      if (buses.length === 0) {
        res.status(200).json({ message: 'No active buses found', routes: [] });
        return;
      }

      const allResults: any[] = [];
      const allTraffic: any[] = [];

      for (const bus of buses) {
        const busId = (bus._id as any).toString();

        // Get students assigned to this bus
        const assignments = await BusAssignment.find({ busId: bus._id }).lean();
        if (assignments.length === 0) continue;

        const studentIds = assignments.map(a => a.studentId);
        const students = await Student.find({ _id: { $in: studentIds } }).lean();
        if (students.length === 0) continue;

        // Map to StudentInput format using real coordinates
        const studentInputs = students.map(s => ({
          id: (s._id as any).toString(),
          name: s.name,
          present: true,
          location: { lat: s.location.lat, lng: s.location.lng }
        }));

        // Bus input
        const busInputs = [{ id: busId, capacity: bus.capacity }];

        // Select strategy dynamically
        if (strategyName === 'cluster') {
          routeOptimizationEngine.setStrategy(new ClusterStrategy());
        } else {
          routeOptimizationEngine.setStrategy(new NearestNeighborStrategy());
        }

        const result = routeOptimizationEngine.generateOptimizedRoute(studentInputs, busInputs);

        // Generate traffic conditions
        for (const busResult of result) {
          const stopCount = busResult.stops.length;
          const trafficConditions = TrafficSimulator.simulateTraffic(stopCount, 'MORNING');
          const pickupWindows = TrafficSimulator.calculatePickupWindows('07:00', stopCount, trafficConditions);
          const adjustedTime = TrafficSimulator.calculateAdjustedTime(stopCount * 5, trafficConditions);

          // Save optimized route to DB with dynamic time windows
          const stops = busResult.stops.map((s: any, idx: number) => ({
            stopName: s.studentName,
            location: s.location,
            pickupTimeWindow: pickupWindows[idx] || { start: '07:00', end: '07:15' }
          }));

          await Route.findOneAndUpdate(
            { busId: new mongoose.Types.ObjectId(busResult.busId) },
            { name: `Morning Route - Bus ${busResult.busId.substring(0, 4).toUpperCase()}`, stops },
            { upsert: true, new: true }
          );

          allResults.push({
            ...busResult,
            pickupWindows,
            adjustedTotalMinutes: adjustedTime
          });

          allTraffic.push({
            busId: busResult.busId,
            conditions: trafficConditions
          });
        }
      }

      res.status(200).json({
        strategy: strategyName,
        routes: allResults,
        traffic: allTraffic,
        message: `Routes optimized and saved for ${allResults.length} bus(es).`
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new RouteController();

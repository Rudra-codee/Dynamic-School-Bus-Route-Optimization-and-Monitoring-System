import { Request, Response } from 'express';
import adminService from '../services/admin.service';

class AdminController {
  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = await adminService.getMetrics();
      res.status(200).json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFleet(req: Request, res: Response): Promise<void> {
    try {
      const fleet = await adminService.getFleet();
      res.status(200).json(fleet);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const alerts = await adminService.getAlerts();
      res.status(200).json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AdminController();

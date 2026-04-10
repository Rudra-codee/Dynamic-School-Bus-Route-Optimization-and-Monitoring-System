import { Request, Response } from 'express';
import { checkSystemHealth } from '../services/health.service';

export const getHealthStatus = (req: Request, res: Response) => {
  try {
    const status = checkSystemHealth();
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

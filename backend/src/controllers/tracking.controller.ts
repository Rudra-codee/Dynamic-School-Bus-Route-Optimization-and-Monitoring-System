import { type Request, type Response } from 'express';
import { trackingService } from '../services/tracking.service';

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { busId, lat, lng } = req.body;
    if (!busId || lat === undefined || lng === undefined) {
      res.status(400).json({ error: 'Missing required fields: busId, lat, lng' });
      return;
    }
    const tracking = await trackingService.updateLocation(busId, lat, lng);
    res.status(201).json(tracking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLatestLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { busId } = req.params;
    if (!busId) {
      res.status(400).json({ error: 'Missing busId' });
      return;
    }
    const tracking = await trackingService.getLatestLocation(busId as string);
    if (!tracking) {
      res.status(404).json({ error: 'No tracking data found for this bus' });
      return;
    }
    res.status(200).json(tracking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

import { type Request, type Response } from 'express';
import { boardingService } from '../services/boarding.service';

export const markBoardingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, busId, status } = req.body;
    if (!studentId || !busId || !status) {
      res.status(400).json({ error: 'Missing required fields: studentId, busId, status' });
      return;
    }
    if (!['BOARDED', 'NOT_BOARDED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be BOARDED or NOT_BOARDED' });
      return;
    }
    const boarding = await boardingService.markBoardingStatus(studentId, busId, status);
    res.status(201).json(boarding);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBoardingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { busId } = req.params;
    if (!busId) {
      res.status(400).json({ error: 'Missing busId' });
      return;
    }
    const list = await boardingService.getBoardingStatus(busId as string);
    res.status(200).json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

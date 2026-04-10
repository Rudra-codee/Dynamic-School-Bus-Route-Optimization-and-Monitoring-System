import { Request, Response } from 'express';
import { attendanceService } from '../services/attendance.service';

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, status } = req.body;
    if (!studentId || !status) {
      res.status(400).json({ error: 'Missing required fields: studentId, status' });
      return;
    }
    if (!['PRESENT', 'ABSENT'].includes(status)) {
      res.status(400).json({ error: 'status must be PRESENT or ABSENT' });
      return;
    }
    const record = await attendanceService.markAttendance(studentId, status);
    res.status(200).json(record);
  } catch (error: any) {
    const isValidationError = error.message?.includes('Invalid studentId') || error.message?.includes('Missing');
    res.status(isValidationError ? 400 : 500).json({ error: error.message });
  }
};

export const getAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const record = await attendanceService.getAttendance(studentId as string);
    if (!record) {
      res.status(404).json({ message: 'No attendance record found for today' });
      return;
    }
    res.status(200).json(record);
  } catch (error: any) {
    const isValidationError = error.message?.includes('Invalid studentId');
    res.status(isValidationError ? 400 : 500).json({ error: error.message });
  }
};

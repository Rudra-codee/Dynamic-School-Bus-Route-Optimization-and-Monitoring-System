import Boarding, { type IBoarding } from '../models/boarding.model';
import mongoose from 'mongoose';
import { boardingEventNotifier } from '../patterns/observer';

export class BoardingService {
  /**
   * Mark student boarding status on a particular bus
   */
  async markBoardingStatus(studentId: string, busId: string, status: 'BOARDED' | 'NOT_BOARDED'): Promise<IBoarding> {
    // Determine the start of the current day to treat statuses as daily events
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const filter = {
      studentId: new mongoose.Types.ObjectId(studentId),
      busId: new mongoose.Types.ObjectId(busId),
      createdAt: { $gte: startOfDay }
    };

    const update = {
      status
    };

    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    };

    const boarding = await Boarding.findOneAndUpdate(filter, update, options);

    // Observer Pattern: Notify parents if status changes
    boardingEventNotifier.notify(studentId, status);

    // WebSockets integration
    import('../socket').then(({ getIO }) => {
      try {
        const io = getIO();
        io.to(`bus_${busId}`).emit('boarding_update', { studentId, busId, status });
        io.emit('fleet_boarding_update', { studentId, busId, status });
      } catch (err) {
        console.error('Socket.io error:', err);
      }
    });

    return boarding as IBoarding;
  }

  /**
   * Get today's boarding status for all students on a bus
   */
  async getBoardingStatus(busId: string): Promise<IBoarding[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return Boarding.find({
      busId: new mongoose.Types.ObjectId(busId),
      createdAt: { $gte: startOfDay }
    }).populate('studentId', 'name email').sort({ updatedAt: -1 }).exec();
  }
}

export const boardingService = new BoardingService();

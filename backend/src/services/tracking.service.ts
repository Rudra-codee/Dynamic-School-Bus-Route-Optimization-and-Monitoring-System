import Tracking, { type ITracking } from '../models/tracking.model';
import mongoose from 'mongoose';

export class TrackingService {
  /**
   * Update the latest location of a bus.
   * This is structured to easily integrate WebSockets in the future.
   */
  async updateLocation(busId: string, lat: number, lng: number): Promise<ITracking> {
    const tracking = new Tracking({
      busId: new mongoose.Types.ObjectId(busId),
      lat,
      lng
    });
    const savedTracking = await tracking.save();
    
    // Future WebSockets integration:
    // import { io } from '../server';
    // io.to(`bus_${busId}`).emit('location_update', { busId, lat, lng });
    
    return savedTracking;
  }

  /**
   * Get the most recent location of a bus.
   */
  async getLatestLocation(busId: string): Promise<ITracking | null> {
    return Tracking.findOne({ busId: new mongoose.Types.ObjectId(busId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}

export const trackingService = new TrackingService();

import Attendance, { IAttendance } from '../models/attendance.model';
import mongoose from 'mongoose';
import routeOptimizationEngine, { NearestNeighborStrategy } from './routeOptimization.service';
import User from '../models/user.model';
import Bus from '../models/bus.model';
import Route from '../models/route.model';

export class AttendanceService {
  /**
   * Mark attendance status for a student (upserts once per day).
   * Triggers route re-optimization after marking.
   */
  async markAttendance(studentId: string, status: 'PRESENT' | 'ABSENT'): Promise<IAttendance> {
    if (!mongoose.isValidObjectId(studentId)) {
      throw new Error(`Invalid studentId: "${studentId}" is not a valid MongoDB ObjectId`);
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const record = await Attendance.findOneAndUpdate(
      {
        studentId: new mongoose.Types.ObjectId(studentId),
        date: startOfDay,
      },
      { status },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Trigger route re-optimization automatically
    await this.triggerRouteOptimization();

    return record as IAttendance;
  }

  /**
   * Get today's attendance record for a specific student.
   */
  async getAttendance(studentId: string): Promise<IAttendance | null> {
    if (!mongoose.isValidObjectId(studentId)) {
      throw new Error(`Invalid studentId: "${studentId}"`);
    }
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return Attendance.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
      date: startOfDay,
    }).populate('studentId', 'name email');
  }

  /**
   * Auto-triggers route re-optimization based on current attendance.
   * Only present students are assigned to routes.
   */
  private async triggerRouteOptimization(): Promise<void> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Get today's present students
      const presentRecords = await Attendance.find({
        date: startOfDay,
        status: 'PRESENT',
      }).lean();

      const presentStudentIds = presentRecords.map(r => r.studentId.toString());

      const allStudents = await User.find({ role: 'student' }).lean();
      const buses = await Bus.find({ status: 'active' }).lean();

      if (allStudents.length === 0 || buses.length === 0) return;

      const studentInputs = allStudents.map((s, i) => ({
        id: (s._id as any).toString(),
        name: s.name,
        present: presentStudentIds.includes((s._id as any).toString()),
        location: { lat: 40.7128 + i * 0.01, lng: -74.0060 + i * 0.01 },
      }));

      const busInputs = buses.map(b => ({
        id: (b._id as any).toString(),
        capacity: b.capacity,
      }));

      routeOptimizationEngine.setStrategy(new NearestNeighborStrategy());
      const optimizedRoutes = routeOptimizationEngine.generateOptimizedRoute(studentInputs, busInputs);

      // Save optimized routes to the Route model
      for (const busResult of optimizedRoutes) {
          const busId = busResult.busId;
          const stops = busResult.stops.map((s: any) => ({
              stopName: s.studentName,
              location: s.location,
              pickupTimeWindow: { start: '07:00', end: '07:15' } // Default time window
          }));

          // Upsert route for the bus
          await Route.findOneAndUpdate(
              { busId: new mongoose.Types.ObjectId(busId) },
              {
                  name: `Morning Route - Bus ${busId.substring(0, 4).toUpperCase()}`,
                  stops: stops
              },
              { upsert: true, new: true }
          );
      }

      console.log(`[Attendance] Route re-optimized and saved: ${optimizedRoutes.length} bus route(s).`);
    } catch (err) {
      console.error('[Attendance] Route optimization failed:', err);
    }
  }
}

export const attendanceService = new AttendanceService();

import Bus, { IBus } from '../models/bus.model';
import Attendance from '../models/attendance.model';
import Route from '../models/route.model';
import mongoose from 'mongoose';

class BusService {
  async createBus(data: Partial<IBus>): Promise<IBus> {
    const bus = new Bus(data);
    return await bus.save();
  }

  async getAllBuses(): Promise<IBus[]> {
    return await Bus.find().populate('driverId', 'name email');
  }

  async getBusById(id: string): Promise<IBus | null> {
    return await Bus.findById(id).populate('driverId', 'name email');
  }

  async updateBus(id: string, data: Partial<IBus>): Promise<IBus | null> {
    return await Bus.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBus(id: string): Promise<IBus | null> {
    return await Bus.findByIdAndDelete(id);
  }

  async getStudentsForBus(busId: string): Promise<any> {
    const User = (await import('../models/user.model')).default;
    let students = await User.find({ role: 'STUDENT' }).select('_id name email');
    
    if (students.length === 0) {
      // Seed demo students if none exist
      const s1 = await new User({ name: 'Alice Smith', email: `alice${Date.now()}@student.com`, role: 'STUDENT', password: 'demo_password' }).save();
      const s2 = await new User({ name: 'Bob Jones', email: `bob${Date.now()+1}@student.com`, role: 'STUDENT', password: 'demo_password' }).save();
      students = [s1, s2];
    }

    const studentIds = students.map(s => s._id);

    // Get today's attendance
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const attendanceRecords = await Attendance.find({
      studentId: { $in: studentIds },
      date: startOfDay
    });

    const presentIds = attendanceRecords.filter(r => r.status === 'PRESENT').map(r => r.studentId.toString());
    const absentIds = attendanceRecords.filter(r => r.status === 'ABSENT').map(r => r.studentId.toString());

    // For the demo, treat un-marked students as present by default
    const unmarkedStudents = students.filter(s => !presentIds.includes(s._id.toString()) && !absentIds.includes(s._id.toString()));
    const finalPresentIds = [...presentIds, ...unmarkedStudents.map(s => s._id.toString())];

    // Get current route for this bus
    const routeDoc = await Route.findOne({ busId: new mongoose.Types.ObjectId(busId) });

    return {
      presentStudents: students.filter(s => finalPresentIds.includes(s._id.toString())).map(s => ({ id: s._id.toString(), name: s.name, email: s.email })),
      absentStudents: students.filter(s => absentIds.includes(s._id.toString())).map(s => ({ id: s._id.toString(), name: s.name, email: s.email })),
      route: routeDoc ? routeDoc.stops.map(stop => ({
          name: stop.stopName,
          lat: stop.location.lat,
          lng: stop.location.lng,
          time: stop.pickupTimeWindow.start
      })) : []
    };
  }

  async addStudentToBus(busId: string, studentData: { name: string, email: string }): Promise<any> {
    const User = (await import('../models/user.model')).default;
    let student = await User.findOne({ name: studentData.name, role: 'STUDENT' });
    
    if (!student) {
      student = new User({
        name: studentData.name,
        email: `student_${Date.now()}_${Math.floor(Math.random()*1000)}@busdemo.com`,
        role: 'STUDENT',
        password: 'demo_password'
      });
      await student.save();
    }
    
    return { id: student._id.toString(), name: student.name, email: student.email };
  }
}

export default new BusService();

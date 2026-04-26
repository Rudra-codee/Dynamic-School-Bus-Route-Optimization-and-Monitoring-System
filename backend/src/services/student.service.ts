import Student, { IStudent } from '../models/student.model';
import BusAssignment from '../models/busAssignment.model';
import mongoose from 'mongoose';

class StudentService {
  async createStudent(data: Partial<IStudent>): Promise<IStudent> {
    const student = new Student(data);
    return await student.save();
  }

  async getAllStudents(): Promise<IStudent[]> {
    return await Student.find().populate('parentId', 'name email');
  }

  async getStudentById(id: string): Promise<IStudent | null> {
    return await Student.findById(id).populate('parentId', 'name email');
  }

  async getStudentsByParent(parentId: string): Promise<IStudent[]> {
    return await Student.find({
      parentId: new mongoose.Types.ObjectId(parentId)
    }).populate('parentId', 'name email');
  }

  async getStudentsByBus(busId: string): Promise<any[]> {
    const assignments = await BusAssignment.find({
      busId: new mongoose.Types.ObjectId(busId)
    }).populate({
      path: 'studentId',
      populate: { path: 'parentId', select: 'name email' }
    });

    return assignments.map(a => ({
      assignment: a,
      student: a.studentId
    }));
  }

  async assignStudentToBus(studentId: string, busId: string, stopName?: string): Promise<any> {
    return await BusAssignment.findOneAndUpdate(
      { studentId: new mongoose.Types.ObjectId(studentId) },
      {
        busId: new mongoose.Types.ObjectId(busId),
        stopName,
        assignedAt: new Date()
      },
      { upsert: true, new: true }
    );
  }

  async removeStudentFromBus(studentId: string): Promise<any> {
    return await BusAssignment.findOneAndDelete({
      studentId: new mongoose.Types.ObjectId(studentId)
    });
  }

  async updateStudent(id: string, data: Partial<IStudent>): Promise<IStudent | null> {
    return await Student.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteStudent(id: string): Promise<IStudent | null> {
    // Also remove bus assignment
    await BusAssignment.findOneAndDelete({ studentId: new mongoose.Types.ObjectId(id) });
    return await Student.findByIdAndDelete(id);
  }

  /**
   * Get the bus assigned to a specific student
   */
  async getBusForStudent(studentId: string): Promise<any | null> {
    const assignment = await BusAssignment.findOne({
      studentId: new mongoose.Types.ObjectId(studentId)
    }).populate('busId');
    return assignment;
  }
}

export default new StudentService();

import mongoose, { Document, Schema } from 'mongoose';

export interface IBusAssignment extends Document {
  studentId: mongoose.Types.ObjectId;
  busId: mongoose.Types.ObjectId;
  stopName?: string;
  assignedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BusAssignmentSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
  stopName: { type: String },
  assignedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// One student assigned to one bus
BusAssignmentSchema.index({ studentId: 1 }, { unique: true });
// Quickly find all students assigned to a bus
BusAssignmentSchema.index({ busId: 1 });

export default mongoose.model<IBusAssignment>('BusAssignment', BusAssignmentSchema);

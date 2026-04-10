import mongoose, { Document, Schema } from 'mongoose';

export interface IBoarding extends Document {
  studentId: mongoose.Types.ObjectId;
  busId: mongoose.Types.ObjectId;
  status: 'BOARDED' | 'NOT_BOARDED';
  createdAt: Date;
  updatedAt: Date;
}

const BoardingSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
  status: { type: String, enum: ['BOARDED', 'NOT_BOARDED'], required: true },
}, {
  timestamps: true
});

// Index to quickly find a student's status on a bus or all students on a bus
BoardingSchema.index({ busId: 1, studentId: 1, createdAt: -1 });
BoardingSchema.index({ busId: 1, createdAt: -1 });

export default mongoose.model<IBoarding>('Boarding', BoardingSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IBus extends Document {
  registrationNumber: string;
  capacity: number;
  driverId: mongoose.Types.ObjectId;
  status: 'active' | 'maintenance' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const BusSchema: Schema = new Schema({
  registrationNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

export default mongoose.model<IBus>('Bus', BusSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  type: 'DELAY' | 'OFF_ROUTE' | 'EMERGENCY' | 'INFO';
  message: string;
  busId?: mongoose.Types.ObjectId;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema: Schema = new Schema({
  type: { type: String, enum: ['DELAY', 'OFF_ROUTE', 'EMERGENCY', 'INFO'], required: true },
  message: { type: String, required: true },
  busId: { type: Schema.Types.ObjectId, ref: 'Bus' },
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
}, {
  timestamps: true
});

export default mongoose.model<IAlert>('Alert', AlertSchema);

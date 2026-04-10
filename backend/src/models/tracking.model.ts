import mongoose, { Document, Schema } from 'mongoose';

export interface ITracking extends Document {
  busId: mongoose.Types.ObjectId;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
}

const TrackingSchema: Schema = new Schema({
  busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, {
  timestamps: true
});

// Index for getting latest location efficiently
TrackingSchema.index({ busId: 1, createdAt: -1 });

export default mongoose.model<ITracking>('Tracking', TrackingSchema);

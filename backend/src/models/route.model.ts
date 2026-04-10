import mongoose, { Document, Schema } from 'mongoose';

export interface IStop {
  stopName: string;
  location: {
    lat: number;
    lng: number;
  };
  pickupTimeWindow: {
    start: string;
    end: string;
  };
}

export interface IRoute extends Document {
  name: string;
  busId: mongoose.Types.ObjectId;
  stops: IStop[];
  createdAt: Date;
  updatedAt: Date;
}

const StopSchema: Schema = new Schema({
  stopName: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  pickupTimeWindow: {
    start: { type: String, required: true }, // e.g., "07:00"
    end: { type: String, required: true }    // e.g., "07:15"
  }
});

const RouteSchema: Schema = new Schema({
  name: { type: String, required: true },
  busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
  stops: [StopSchema]
}, {
  timestamps: true
});

export default mongoose.model<IRoute>('Route', RouteSchema);

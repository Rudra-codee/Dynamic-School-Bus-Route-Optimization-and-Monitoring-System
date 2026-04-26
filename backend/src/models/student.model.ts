import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  parentId: mongoose.Types.ObjectId;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  grade?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  grade: { type: String }
}, {
  timestamps: true
});

// Index for quickly finding students by parent
StudentSchema.index({ parentId: 1 });

export default mongoose.model<IStudent>('Student', StudentSchema);

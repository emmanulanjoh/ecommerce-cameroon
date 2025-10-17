import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  filename: string;
  s3Key: string;
  s3Url: string;
  fileSize: number;
  isActive: boolean;
  uploadDate: Date;
}

const VideoSchema = new Schema<IVideo>({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  s3Key: {
    type: String,
    required: true,
    unique: true
  },
  s3Url: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

export const Video = mongoose.model<IVideo>('Video', VideoSchema);
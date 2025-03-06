import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  position: string;
  websiteUrl: string;
  email: string;
  socialMediaLinks: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  websiteUrl: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  socialMediaLinks: [{
    type: String,
    trim: true
  }],
}, {
  timestamps: true
});

export default mongoose.model<IClient>('Client', ClientSchema); 
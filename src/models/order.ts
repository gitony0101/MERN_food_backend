import mongoose from 'mongoose';
import Restaurant from './restaurant';

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurant' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  deliveryDetails: {
    email: { type: String, required: true },
  },
});

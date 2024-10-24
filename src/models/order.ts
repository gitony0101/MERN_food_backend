import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant',
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  deliveryDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
  },
  cartItems: [
    {
      menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menuItem',
        required: true,
      },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  totalAmount: { type: Number, required: false },
  status: {
    type: String,
    enum: ['placed', 'paid', 'inProgress', 'outForDelivery', 'delivered'],
    default: 'placed',
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

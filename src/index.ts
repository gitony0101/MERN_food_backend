import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import myUserRoute from './routes/MyUserRoute';
import myRestaurantRoute from './routes/MyRestaurantRoute';
import { v2 as cloudinary } from 'cloudinary';
import RestaurantRoute from './routes/RestaurantRoute';
import orderRoute from './routes/OrderRoute';

// Connect to MongoDB database using the connection string from environment variables
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to MongoDB Database.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Configure Cloudinary using the credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'Health OK!' }); // Send a success
});

app.use('/api/my/user', myUserRoute);

app.use('/api/my/restaurant', myRestaurantRoute);
app.use('/api/restaurant', RestaurantRoute);
app.use('/api/order', orderRoute);

app.listen(port, () => console.log(`Server started on localhost:${port}`));

import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import myUserRoute from './routes/MyUserRoute';
import myRestaurantRoute from './routes/MyRestaurantRoute';
import { v2 as cloudinary } from 'cloudinary';

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

// Create an express app
const app = express();
const port = process.env.PORT; // Retrieve port number from environment variables

app.use(express.json()); // Use built-in express middleware to parse JSON requests
app.use(cors()); // Enable CORS for all routes

// Simple health check route to verify server is running, often used in deployment testing
app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'Health OK!' }); // Send a success message if the server is running
});

// Register user-related routes, all starting with /api/my/user
app.use('/api/my/user', myUserRoute);

// Register restaurant-related routes, all starting with /api/my/restaurant
app.use('/api/my/restaurant', myRestaurantRoute);

// Start the server on the specified port and log a message
app.listen(port, () => console.log(`Server started on localhost:${port}`));

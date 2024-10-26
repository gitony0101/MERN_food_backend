import { Request, Response } from 'express';
import Restaurant from '../models/restaurant';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import Order from '../models/order';

// Helper function to upload image to Cloudinary
const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString('base64'); // Convert image buffer to base64 string
  const dataURI = `data:${image.mimetype};base64,${base64Image}`; // Create a Data URI with base64-encoded image
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI); // Upload the image to Cloudinary
  return uploadResponse.url; // Return the URL of the uploaded image
};

// Function to create a new restaurant
const createMyRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Check if the user already has a restaurant
    const existingRestaurants = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurants) {
      res.status(409).json({ message: 'User restaurant already exists.' });
      return; // Stop the function execution if restaurant exists
    }

    // Check if an image file is provided in the request
    if (!req.file) {
      res.status(400).json({ message: 'No image file uploaded.' });
      return; // Stop the function execution if no file is provided
    }

    // Upload the image using the helper function
    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    // Create a new restaurant object with data from the request
    const restaurant = new Restaurant({
      ...req.body, // Spread the body to populate fields like name, city, etc.
      imageUrl: imageUrl, // Add the uploaded image URL
      user: new mongoose.Types.ObjectId(req.userId), // Set the user ID for the restaurant
      lastUpdated: new Date(), // Set the last updated time
    });

    // Save the new restaurant to the database
    await restaurant.save();

    // Send a success response with the created restaurant
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error); // Log any errors to the console
    res.status(500).json({ message: 'Something went wrong.' }); // Send a generic error response
  }
};

// Function to get the user's restaurant
const getMyRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find the restaurant by user ID
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found.' });
      return; // Stop the function if no restaurant is found
    }
    res.json(restaurant); // Return the found restaurant
  } catch (error) {
    console.log('Error', error); // Log any errors
    res.status(500).json({ message: 'Error fetching restaurant.' }); // Send a generic error response
  }
};

// Function to update the user's restaurant
const updateMyRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Find the restaurant by user ID
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found.' });
      return; // Stop the function if no restaurant is found
    }

    // Update the restaurant fields with the data from the request
    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date(); // Update the last updated time

    // If a new image file is uploaded, upload it to Cloudinary and update the imageUrl
    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    // Save the updated restaurant in the database
    await restaurant.save();

    // Send a success response with the updated restaurant
    res.status(200).send(restaurant);
  } catch (error) {
    console.log('error', error); // Log any errors
    res.status(500).json({ message: 'Something went wrong.' }); // Send a generic error response
  }
};

const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return; // Stop the function if no restaurant is found
    }
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate('restaurant')
      .populate('user');

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  const restaurant = await Restaurant.findById(order.restaurant);
  if (restaurant?.user?._id.toString() !== req.userId) {
    res.status(401).send();
    return;
  }
  order.status = status;
  await order.save();
  res.status(200).json(order);

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Unable t oupdate order status' });
  }
};

export default {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
  updateOrderStatus,
};

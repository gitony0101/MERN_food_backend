import express from 'express';
import multer from 'multer';
import MyRestaurantController from '../controllers/MyRestaurantController';
import { validateMyRestaurantRequest } from '../middleware/validation';
import { jwtCheck } from '../middleware/jwtCheck.middleware';
import { jwtParse } from '../middleware/jwtParse.middleware';

const router = express.Router(); // Create an instance of an Express router

// Set up multer's in-memory storage configuration to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage, // Use in-memory storage for uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Define GET route to retrieve the user's restaurant information
// The request is authenticated with jwtCheck, the user info is extracted with jwtParse, and then the getMyRestaurant function from MyRestaurantController is called
router.get('/', jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

// Define POST route to create a new restaurant
// This handles file upload, validates the request body, checks authentication and parses the user data before calling the createMyRestaurant function
router.post(
  '/',
  upload.single('imageFile'), // Handle single image file upload with multer
  validateMyRestaurantRequest, // Validate restaurant data from request body
  jwtCheck, // Authenticate the request using JWT
  jwtParse, // Parse JWT and extract user info
  MyRestaurantController.createMyRestaurant, // Create a new restaurant in the database
);

// Define PUT route to update an existing restaurant
// Similar to the POST route, it handles file uploads, validates request body, checks authentication, and then calls updateMyRestaurant function to update restaurant data
router.put(
  '/',
  upload.single('imageFile'), // Handle single image file upload for updates
  validateMyRestaurantRequest, // Validate restaurant data from request body
  jwtCheck, // Authenticate the request using JWT
  jwtParse, // Parse JWT and extract user info
  MyRestaurantController.updateMyRestaurant, // Update the existing restaurant data in the database
);

export default router; // Export the router so it can be used in other parts of the application

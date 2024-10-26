import express from 'express';
import multer from 'multer';
import MyRestaurantController from '../controllers/MyRestaurantController';
import { validateMyRestaurantRequest } from '../middleware/validation';
import { jwtCheck } from '../middleware/jwtCheck.middleware';
import { jwtParse } from '../middleware/jwtParse.middleware';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage, // Use in-memory storage for uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

router.get(
  '/order',
  jwtCheck,
  jwtParse,
  MyRestaurantController.getMyRestaurantOrders,
);

router.patch(
  '/order/:orderId/status',
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateOrderStatus,
);

router.get('/', jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

router.post(
  '/',
  upload.single('imageFile'), // Handle single image file upload with multer
  validateMyRestaurantRequest, // Validate restaurant data from request body
  jwtCheck, // Authenticate the request using JWT
  jwtParse, // Parse JWT and extract user info
  MyRestaurantController.createMyRestaurant, // Create a new restaurant in the database
);

router.put(
  '/',
  upload.single('imageFile'), // Handle single image file upload for updates
  validateMyRestaurantRequest, // Validate restaurant data from request body
  jwtCheck, // Authenticate the request using JWT
  jwtParse, // Parse JWT and extract user info
  MyRestaurantController.updateMyRestaurant, // Update the existing restaurant data in the database
);

export default router; // Export the router so it can be used in other parts of the application

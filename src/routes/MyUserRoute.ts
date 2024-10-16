import express from 'express';
import MyUserController from '../controllers/MyUserController';
import { jwtCheck } from '../middleware/jwtCheck.middleware';
import { jwtParse } from '../middleware/jwtParse.middleware';
import { validateMyUserRequest } from '../middleware/validation';

const router = express.Router(); // Create an instance of an Express router

// Define the route for getting the current user's data
// The request is authenticated with jwtCheck, the user information is extracted with jwtParse, and then the getCurrentUser function from MyUserController is called.
router.get('/', jwtCheck, jwtParse, MyUserController.getCurrentUser);

// Define the route for creating a new user
// This request is authenticated with jwtCheck and then calls createCurrentUser function from MyUserController.
router.post('/', jwtCheck, MyUserController.createCurrentUser);

// Define the route for updating the current user's data
// This request is authenticated with jwtCheck, the user data is parsed with jwtParse, validated using validateMyUserRequest, and then calls updateCurrentUser from MyUserController.
router.put(
  '/',
  jwtCheck,
  jwtParse,
  validateMyUserRequest, // Middleware to validate the user data before updating
  MyUserController.updateCurrentUser,
);

export default router; // Export the router so it can be used in other parts of the application

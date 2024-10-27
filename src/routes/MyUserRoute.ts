import express from 'express';
import MyUserController from '../controllers/MyUserController';
import { jwtCheck } from '../middleware/jwtCheck.middleware';
import { jwtParse } from '../middleware/jwtParse.middleware';
import { validateMyUserRequest } from '../middleware/validation';

const router = express.Router(); // Create an instance of an Express router

router.get('/', jwtCheck, jwtParse, MyUserController.getCurrentUser);

router.post('/', jwtCheck, MyUserController.createCurrentUser);

router.put(
  '/',
  jwtCheck,
  jwtParse,
  validateMyUserRequest, // Middleware to validate the user data before updating
  MyUserController.updateCurrentUser,
);

export default router; // Export the router so it can be used in other parts of the application

import express from 'express';
import multer from 'multer';
import MyRestaurantController from '../controllers/MyRestaurantController';
import { jwtCheck } from '../middleware/jwtCheck.middleware';
import { jwtParse } from '../middleware/jwtParse.middleware';
import { validateRestaurantRequest } from '../middleware/validation';

const router = express.Router();

// image configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// api/my/restaurant
router.post(
  '/',
  validateRestaurantRequest,
  jwtCheck,
  jwtParse,
  upload.single('imageFile'),
  MyRestaurantController.createMyRestaurant,
);

export default router;

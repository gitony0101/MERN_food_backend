import express from 'express';
import { param } from 'express-validator';
import RestaurantController from '../controllers/RestaurantController';

const router = express.Router();

router.get(
  '/:restaurantId',
  param('restaurantId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Restaurant ID must be a valid string'),
  RestaurantController.getRestaurant,
);

// api/restaurant/search/some city
router.get(
  '/search/:city',
  param('city')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('City parameter must be a string'),
  RestaurantController.searchRestaurant,
);

export default router;

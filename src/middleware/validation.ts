import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const handleValidationErrors: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; // 确保函数在这里终止
  }
  next();
};

export const validateMyUserRequest: RequestHandler[] = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name must be a non-empty string'), // 验证 name 必须是非空字符串
  body('addressLine1')
    .isString()
    .notEmpty()
    .withMessage('addressLine1 must be a non-empty string'), // 验证 addressLine1 必须是非空字符串
  body('city')
    .isString()
    .notEmpty()
    .withMessage('City must be a non-empty string'), // 验证 city 必须是非空字符串
  body('country')
    .isString()
    .notEmpty()
    .withMessage('Country must be a non-empty string'), // 验证 country 必须是非空字符串
  handleValidationErrors, // 使用修正后的错误处理函数
];

export const validateRestaurantRequest = [
  body('restaurantName').notEmpty().withMessage('Restaurant name is required'),
  body('city').notEmpty().withMessage('City name is required'),
  body('country').notEmpty().withMessage('Country name is required'),
  body('deliveryPrice')
    .isFloat({ min: 0 })
    .withMessage('Delivery price must be a positive number'),
  body('estimatedDeliveryTime')
    .isInt({ min: 0 })
    .withMessage('Estimated delivery time must be a positive integer'),
  body('cuisines')
    .isArray()
    .withMessage('Cuisines must be an array')
    .not()
    .isEmpty()
    .withMessage('Cuisines array can not be empty'),
  body('menuItems').isArray().withMessage('Menu items must be an array'),
  body('menuItems.*.name').notEmpty().withMessage('Menu item name is required'),
  body('menuItems.*.price')
    .isFloat({ min: 0 })
    .notEmpty()
    .withMessage('Menu item price is required and must be a positive number'),
  handleValidationErrors,
];

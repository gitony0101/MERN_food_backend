import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Handle validation errors and return a response if there are any
const handleValidationErrors: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() }); // Return a 400 error with details of validation issues
    return; // Ensure the function stops here if errors exist
  }
  next(); // Proceed to the next middleware if no errors
};

// Validate user input for user-related operations
export const validateMyUserRequest: RequestHandler[] = [
  body('name')
    .isString() // Validate that 'name' is a string
    .notEmpty() // Ensure 'name' is not empty
    .withMessage('Name must be a non-empty string'), // Return this message if validation fails
  body('addressLine1')
    .isString() // Validate that 'addressLine1' is a string
    .notEmpty() // Ensure 'addressLine1' is not empty
    .withMessage('addressLine1 must be a non-empty string'), // Error message for failed validation
  body('city')
    .isString() // Validate that 'city' is a string
    .notEmpty() // Ensure 'city' is not empty
    .withMessage('City must be a non-empty string'), // Error message for failed validation
  body('country')
    .isString() // Validate that 'country' is a string
    .notEmpty() // Ensure 'country' is not empty
    .withMessage('Country must be a non-empty string'), // Error message for failed validation
  handleValidationErrors, // Use the error handler to return any validation errors
];

// Validate input for restaurant-related operations
export const validateMyRestaurantRequest = [
  body('restaurantName')
    .notEmpty() // Ensure 'restaurantName' is not empty
    .withMessage('Restaurant name is required'), // Error message for missing restaurant name
  body('city')
    .notEmpty() // Ensure 'city' is not empty
    .withMessage('City is required'), // Error message for missing city
  body('country')
    .notEmpty() // Ensure 'country' is not empty
    .withMessage('Country is required'), // Error message for missing country
  body('deliveryPrice')
    .isFloat({ min: 0 }) // Validate that 'deliveryPrice' is a positive float
    .withMessage('Delivery price must be a positive number'), // Error message for invalid delivery price
  body('estimatedDeliveryTime')
    .isInt({ min: 0 }) // Validate that 'estimatedDeliveryTime' is a positive integer
    .withMessage('Estimated delivery time must be a positive integer'), // Error message for invalid delivery time
  body('cuisines')
    .isArray() // Validate that 'cuisines' is an array
    .withMessage('Cuisines must be an array') // Error message for invalid cuisines format
    .not() // Ensure the array is not empty
    .isEmpty() // Make sure the cuisines array is not empty
    .withMessage('Cuisines array cannot be empty'), // Error message for empty cuisines array
  body('menuItems')
    .isArray() // Validate that 'menuItems' is an array
    .withMessage('Menu items must be an array'), // Error message for invalid menu items
  body('menuItems.*.name')
    .notEmpty() // Ensure each menu item's 'name' is not empty
    .withMessage('Menu item name is required'), // Error message for missing menu item name
  body('menuItems.*.price')
    .isFloat({ min: 0 }) // Validate that each menu item's 'price' is a positive float
    .withMessage('Menu item price is required and must be a positive number'), // Error message for invalid menu item price
  handleValidationErrors, // Use the error handler to return validation errors
];

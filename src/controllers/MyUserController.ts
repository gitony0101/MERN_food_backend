import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

// Get the current user based on the userId extracted from the JWT
const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Find the current user in the database using the userId from the JWT
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      // If no user is found, return a 404 response
      res.status(404).json({ message: 'User not found' });
      return;
    }
    // Return the found user as JSON response
    res.json(currentUser);
  } catch (error) {
    console.log(error); // Log any errors that occur during the database operation
    res.status(500).json({ message: 'Something went wrong' }); // Return a 500 error if something goes wrong
    next(error); // Pass the error to the next middleware for error handling
  }
};

// Create a new user if the user does not exist
const createCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract auth0Id from the request body
    const { auth0Id } = req.body;

    // Check if a user already exists in the database with the given auth0Id
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      // If the user exists, return the existing user with a 200 status code
      res.status(200).json(existingUser);
      return;
    }

    // If the user doesn't exist, create a new User instance with the request body data
    const newUser = new User(req.body);

    // Save the new user to the database
    await newUser.save();

    // Return the newly created user with a 201 status code
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error); // Log any errors during the user creation process
    next(error); // Pass the error to the next middleware for error handling
  }
};

// Update the existing user's details
const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Destructure the user details from the request body
    const { name, addressLine1, country, city } = req.body;

    // Find the user by their ID, which was extracted from the JWT
    const user = await User.findById(req.userId);
    if (!user) {
      // If no user is found, return a 404 response
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Update the user's details with the values provided in the request body
    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    // Save the updated user to the database
    await user.save();

    // Return the updated user with a 200 status code
    res.status(200).json(user);
  } catch (error) {
    console.log(error); // Log any errors during the update process
    next(error); // Pass the error to the next middleware for error handling
  }
};

// Export the functions so they can be used in the router
export default { getCurrentUser, createCurrentUser, updateCurrentUser };

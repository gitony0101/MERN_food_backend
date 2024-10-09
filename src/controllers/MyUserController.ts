import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

// Get current user
const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
    next(error); // Pass the error to the error-handling middleware
  }
};

// Create a new user
const createCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Check if the user already exists
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      res.status(200).json(existingUser); // Return existing user object
      return;
    }

    // 2. If user does not exist, create a new one
    const newUser = new User(req.body);
    await newUser.save();

    // 3. Return the newly created user object to the client
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    next(error); // Pass the error to the error-handling middleware
  }
};

// Update the user
const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Update user information
    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;
    await user.save();

    res.status(200).json(user); // Return updated user object
  } catch (error) {
    console.log(error);
    next(error); // Pass the error to the error-handling middleware
  }
};

export default { getCurrentUser, createCurrentUser, updateCurrentUser };

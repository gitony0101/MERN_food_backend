import { Request, Response } from 'express';
import User from '../models/user';

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    // 1. Check if the user exists
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      res.status(200).send();
      return;
    }
    // 2. Create the user if it doesn't exist
    const newUser = new User(req.body);
    await newUser.save();
    // 3. return the user object to the calling client
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export default { createCurrentUser };

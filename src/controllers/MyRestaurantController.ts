import { Request, Response } from 'express';
import Restaurant from '../models/restaurant';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString('base64');
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};
const createMyRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      res.status(409).json({ message: 'User restaurant already exists.' });
      return;
    }
    // Log body and file to check if data is coming through correctly
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    if (!req.file) {
      res.status(400).json({ message: 'No image file uploaded.' });
      return;
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);
    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

export default { createMyRestaurant };

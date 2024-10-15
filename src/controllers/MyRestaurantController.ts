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
    // console.log('Request Body:', req.body);
    // console.log('Request File:', req.file);
    // 检查用户是否已有餐厅
    const existingRestaurants = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurants) {
      res.status(409).json({ message: 'User restaurant already exists.' });
      return; // 确保函数在这里结束
    }

    // 检查文件是否存在
    if (!req.file) {
      res.status(400).json({ message: 'No image file uploaded.' });
      return; // 确保函数在这里结束
    }

    // // 处理图片上传
    // const image = req.file as Express.Multer.File;
    // const base64Image = Buffer.from(image.buffer).toString('base64');
    // const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    // 创建新餐厅
    const restaurant = new Restaurant({
      ...req.body,
      imageUrl: imageUrl,
      user: new mongoose.Types.ObjectId(req.userId),
      lastUpdated: new Date(),
    });

    // 保存餐厅
    await restaurant.save();

    // 返回创建成功的响应
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const getMyRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found.' });
      return;
    }
    res.json(restaurant);
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: 'Error fetching restaurant.' });
  }
};

const updateMyRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found.' });
      return;
    }
    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }
    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

export default { createMyRestaurant, getMyRestaurant, updateMyRestaurant };

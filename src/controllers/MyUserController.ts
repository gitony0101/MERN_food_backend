import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

// 创建用户
const createCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. 检查用户是否存在
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      res.status(200).json(existingUser); // 返回已存在的用户对象
      return;
    }
    // 2. 如果不存在则创建新用户
    const newUser = new User(req.body);
    await newUser.save();
    // 3. 返回新创建的用户对象给客户端
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    next(error); // 调用 next 将错误传递给错误处理程序
  }
};

// 更新用户
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

    // 更新用户信息
    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;
    await user.save();

    res.status(200).json(user); // 返回更新后的用户对象
  } catch (error) {
    console.log(error);
    next(error); // 调用 next 将错误传递给错误处理程序
  }
};

export default { createCurrentUser, updateCurrentUser };

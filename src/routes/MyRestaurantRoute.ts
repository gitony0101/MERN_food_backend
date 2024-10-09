import express from 'express';
import multer from 'multer';
import MyRestaurantController from '../controllers/MyRestaurantController';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制文件大小为 5MB
});

// api/my/restaurant
router.post(
  '/',
  upload.single('imageFile'),
  MyRestaurantController.createMyRestaurant,
);

export default router;

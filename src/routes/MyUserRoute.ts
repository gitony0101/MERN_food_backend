import express from 'express';
import MyUserController from '../controllers/MyUserController';
import { jwtCheck } from '../middleware/jwtCheck.middleware';
import { jwtParse } from '../middleware/jwtParse.middleware';
import { validateMyUserRequest } from '../middleware/validation';

const router = express.Router();

// api/my.user
router.get('/', jwtCheck, jwtParse, MyUserController.getCurrentUser);

router.post('/', jwtCheck, MyUserController.createCurrentUser);
router.put(
  '/',
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser,
);

export default router;

import express from 'express';

import OrderController from '../controllers/OrderController';
import { jwtCheck } from '../middleware/jwtCheck.middleware';
import { jwtParse } from '../middleware/jwtParse.middleware';

const router = express.Router();

router.post(
  '/checkout/create-checkout-session',
  jwtCheck,
  jwtParse,
  OrderController.createCheckoutSession,
);

export default router;

import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const handleValidationErrors: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; // 确保函数在这里终止
  }
  next();
};

export const validateMyUserRequest: RequestHandler[] = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name must be a non-empty string'), // 验证 name 必须是非空字符串
  body('addressLine1')
    .isString()
    .notEmpty()
    .withMessage('addressLine1 must be a non-empty string'), // 验证 addressLine1 必须是非空字符串
  body('city')
    .isString()
    .notEmpty()
    .withMessage('City must be a non-empty string'), // 验证 city 必须是非空字符串
  body('country')
    .isString()
    .notEmpty()
    .withMessage('Country must be a non-empty string'), // 验证 country 必须是非空字符串
  handleValidationErrors, // 使用修正后的错误处理函数
];

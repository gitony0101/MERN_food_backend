import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

// JWT 检查中间件
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

// JWT 解析中间件
export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ message: 'No authorization header found or incorrect format' });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (!decoded || typeof decoded.sub !== 'string') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    const auth0Id = decoded.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    console.error('Error parsing JWT:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

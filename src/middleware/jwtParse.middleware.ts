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

// Middleware to parse JWT and attach user information to the request
export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Extract the authorization header from the request
  const { authorization } = req.headers;

  // If the authorization header is missing or not in Bearer format, return a 401 error
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ message: 'No authorization header found or incorrect format' });
    return;
  }

  // Extract the JWT token from the authorization header
  const token = authorization.split(' ')[1];

  try {
    // Decode the JWT token and extract the payload
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    // If the token is invalid or does not contain a valid subject (sub), return a 401 error
    if (!decoded || typeof decoded.sub !== 'string') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Extract the auth0Id (usually the user's unique identifier) from the token
    const auth0Id = decoded.sub;

    // Find the user in the database using the auth0Id
    const user = await User.findOne({ auth0Id });

    // If the user is not found, return a 404 error
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Attach the auth0Id and userId to the request object for further use in the application
    req.auth0Id = auth0Id;
    req.userId = user._id.toString();

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If any error occurs during the JWT decoding or database lookup, return a 401 error
    console.error('Error parsing JWT:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

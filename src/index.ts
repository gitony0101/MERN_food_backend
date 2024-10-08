import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import myUserRoute from './routes/MyUserRoute';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to MongoDB Database.'));

const app = express();
const port = process.env.PORT || 5100;

app.use(express.json());
app.use(cors());

app.use('/api/my/user', myUserRoute);

app.listen(port, () => console.log(`Server started on localhost:${port}`));

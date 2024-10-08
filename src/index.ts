import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5100;

app.use(express.json());
app.use(cors());

app.get('/test', async (req: Request, res: Response) => {
  res.json({ message: 'Hello!' });
});

app.listen(port, () => console.log(`Server started on localhost:${port}`));

import express, { Request, Response } from 'express';
import testRoutes from './routes/test.routes';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express!');
});


app.use('/test', testRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

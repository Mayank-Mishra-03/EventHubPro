import express from 'express';
import userRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());


app.use('/api/v1/users', userRoutes);
export default app;
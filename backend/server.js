import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import setupMailer from './utils/mailer.js';

const port = process.env.PORT || 5000;

connectDB();
setupMailer();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send("Server is up and running.");
})

app.listen(port, () => {
    console.log(`⚡ [server] Started listening on http://localhost:${port}`);
})

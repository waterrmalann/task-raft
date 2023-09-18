import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import setupMailer from './utils/mailer.js';

const port = process.env.PORT || 5000;

connectDB();
setupMailer();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/boards', boardRoutes);

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`⚡ [server] Started listening on http://localhost:${port}`);
})

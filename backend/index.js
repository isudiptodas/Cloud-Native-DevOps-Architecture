import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userAuth from './routes/auth.js';
import fileUpload from './routes/uploadFile.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        process.env.FRONTEND_PRODUCTION_URL,
        process.env.FRONTEND_DEVELOPMENT_URL,
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST',],
    credentials: true,
}));

app.use(userAuth);
app.use(fileUpload);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server started');
})
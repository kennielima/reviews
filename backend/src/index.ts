import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from './routes/auth.route';
import reviewsRoute from './routes/reviews.route';

const app = express();
dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))
app.use(cookieParser())

app.use('/', authRoute)
app.use('/', reviewsRoute)

app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`)
})
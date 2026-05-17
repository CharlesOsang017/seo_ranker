import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import rankRoutes from './routes/rank.route.js';
import analysisRoutes from './routes/analysis.route.js';
import { auth } from './middlewares/auth.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rank", auth, rankRoutes);
app.use("/api/analysis", auth, analysisRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
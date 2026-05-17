import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import rankRoutes from './routes/rank.route.js';
import analysisRoutes from './routes/analysis.route.js';
import { auth } from './middlewares/auth.middleware.js';
import { startRankTrackingCron } from './cron/startRankTracking.cron.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rank", auth, rankRoutes);
app.use("/api/analysis", auth, analysisRoutes);


// start cron jobs
startRankTrackingCron()

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("<h3>Welcome to SEO Ranker API!</h3>");
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
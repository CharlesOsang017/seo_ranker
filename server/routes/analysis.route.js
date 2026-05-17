import express from 'express'
import { analyzeUrl, getAllAnalysisForUser, getAnalysisById, deleteAnalysis } from '../controllers/analysis.controller.js';


const router = express.Router()

router.post("/analyze", analyzeUrl);
router.get("/list",  getAllAnalysisForUser);
router.get("/:id", getAnalysisById);
router.delete("/:id", deleteAnalysis);

export default router;
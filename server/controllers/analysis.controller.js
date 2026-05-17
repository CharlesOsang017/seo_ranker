import Analysis from "../models/analysis.model.js";
import { scrapeUrl } from "../services/scraper.service.js";

// Analyze  a URL
export const analyzeUrl = async (req, res)=>{
    try {
        const {url} = req.body;
        if(!url){
            return res.status(400).json({success: false, message:"URL is required"})
        }
        // Validate URL format
        let validUrl;
        try {
          validUrl = new URL(url.startsWith("http") ? url : `https://${url}`);

        } catch (error) {
            return res.status(400).json({success:false, message:"Invalid URL format"})
        }

        // Create analysis record with pending status
        const analysis = await Analysis.create({userId: req.userId, url: validUrl.href, status: "processing"});
        // send immediate response with analysis ID
        res.json({success: true, message: "Analysis started", analysisId: analysis._id});
   
        // Run Scraping and analysis in background
        try {
            // 1. Scrape the URL with BrowserBase
            const scrapeResult = await scrapeUrl(validUrl.href);

            if(!scrapeResult.success){
                analysis.status = 'failed';
                await analysis.save();
                return;
            }

            // 2. Analyze with Gemini AI
            const aiResult = await analyzeSeoData(scrapeResult.data);

            if(!aiResult.success){
                analysis.status = 'failed';
                await analysis.save();
                return;
            }

            // 3. Save results
            analysis.overalScore = aiResult.data.overalScore || 0;
            analysis.categories = aiResult.data.categories || {};
            analysis.metadata = scrapeResult.data.metaData || {};
            analysis.headings = scrapeResult.data.headings || {};
            analysis.links = scrapeResult.data.links || {};
            analysis.images = scrapeResult.data.images || {};
            analysis.keywords = aiResult.data.keywords || [];
            analysis.issues = aiResult.data.issues || [];
            analysis.loadTime = scrapeResult.data.loadTime || 0;
            analysis.pageSize = scrapeResult.data.pageSize || 0;
            analysis.wordCount = scrapeResult.data.wordCount || 0

            analysis.status = 'completed';
            await analysis.save();

        } catch (bgError) {
            console.error("Background analysis error:", bgError.message);
            
            try {
                analysis.status = 'failed';
            await analysis.save();
            } catch (saveError) {
                console.error("Error Saving analysis status", saveError.message)
            }
        }
    } catch (error) {
        console.error("Analyze URL error:", error.message);
        if(!res.headersSent){
            res.status(500).json({success:false, message:"Error analyzing URL"});
        }
    }   
}

// Get analysis by ID
export const getAnalysisById = async (req, res)=>{
    try {
        const analysis = await Analysis.findOne({_id: req.params.id, userId: req.userId});
        if(!analysis){
            return res.status(404).json({success: false, message: "Analysis not found"});
        }
        res.json({success: true, analysis})
    } catch (error) {
        console.error("Error fetching analysis by ID:",error.message)
       return res.status(500).json({success: false, message: "server error"})
    }
}

// Get all analysis for a user
export const getAllAnalysisForUser = async (req, res)=>{
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const analyses = (await Analysis.find({userId: req.userId})).toSorted({createdAt: -1}).skip(skip).limit(limit).select("-issues -keywords");
      const total = await Analysis.countDocuments({userId: req.userId})
      res.json({success: true, analyses, pagination: {page, limit, total, pages: Math.ceil(total / limit)}})
    } catch (error) {
        console.error("Error fetching analysis for user:",error.message)
       return res.status(500).json({success: false, message: "server error"})
    }
}

// Delete analysis
export const deleteAnalysis = async (req, res)=>{
    try {
        const analysis = await Analysis.findOne({_id: req.params.id, userId: req.userId});
        if(!analysis){
            return res.status(404).json({success: false, message: "Analysis not found"});
        }
        await analysis.deleteOne();
        res.json({success: true, message: "Analysis deleted"})
    } catch (error) {
        console.error("Error deleting analysis:",error.message)
       return res.status(500).json({success: false, message: "server error"})
    }
}
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
    
}

// Get all analysis for a user
export const getAllAnalysisForUser = async (req, res)=>{
    
}

// Delete analysis
export const deleteAnalysis = async (req, res)=>{
    
}
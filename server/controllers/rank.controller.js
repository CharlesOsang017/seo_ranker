import KeywordTracking from "../models/rankTracking.model.js";
import { keywordTracking } from "../services/keywordTracking.service.js";

// Add a keyword to track
export const addKeyword = async(req, res)=>{
    try {
        const {keyword, url} = req.body
        if(!keyword || !url){
            return res.status(400).json({success: false, message: "Keyword and url are required"})
        }

        // extract domain from url
        let domain;
        try {
            const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
            domain = parsedUrl.hostname.replace("www.","");
        } catch (error) {
            return res.status(400).json({success: false, message: "Invalid URL format"})
        }

        // check if user already tracking this keyword+domain
        const existingKeyword = await KeywordTracking.findOne({
            userId: req.userId,
            keyword: keyword.toLowerCase().trim(),
            domain
        })
        if(existingKeyword){
            return res.status(400).json({success: false, message: "You are already tracking this keyword"})
        }
        // Create tracking entry
        const tracking = await KeywordTracking.create({
            userId: req.userId,
            keyword: keyword.toLowerCase().trim(),
            url: url.startsWith("http") ? url : `https://${url}`,
            domain,
            status: "checking",
        })
        res.status(201).json({success: true, message: "Keyword tracking started", tracking})
        keywordTracking(tracking)
       
    } catch (error) {
        console.log("Error in addKeyword controller:", error.message)
        if(error.code === 11000){
            return res.status(400).json({success: false, message: "You are already tracking this keyword"})
        }
        res.status(500).json({success: false, message: "Internal server error"})
    }

}
// Get all tracked keywords for user
export const getKeywords = async(req, res)=>{
 try {
    const keywords = await KeywordTracking.find({userId: req.userId}).sort({createdAt: -1}).select("-rankHistory")

    return res.status(200).json({success: true, keywords})
    
 } catch (error) {
    console.log("Error in getKeywords controller:", error.message)
    res.status(500).json({success: false, message: "Internal server error"})
 }
}

// Get single keyword with full history and competitors
export const getKeyword = async(req, res)=>{
    try {        
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId})
        if(!tracking){
            return res.status(404).json({success: false, message: "Keyword not found"})
        }
        return res.status(200).json({success: true, keyword})


    } catch (error) {
        console.log("Error in getKeyword controller:", error.message)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}

// Manualy refresh a keyword ranking
export const refreshKeyword = async(req, res)=>{
    try {
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId})
        if(!tracking){
            return res.status(404).json({success: false, message: "Keyword not found"})
        }
        tracking.status = "checking"
        await tracking.save()
        res.status(200).json({success: true, message: "Rank checking started"})
        keywordTracking(tracking)

    } catch (error) {
        console.log("Error in refreshKeyword controller:", error.message)
        res.status(500).json({success: false, message: "Internal server error"})
    }
}

// Delete a tracked keyword
export const deleteKeyword = async(req, res)=>{

}

// Toggle auto-refresh for a keyword
export const toggleAutoRefresh = async(req, res)=>{

}

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// Register User
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: "Please fill all the fields"});
        }
// Check existing user
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({success: false, message: "User already exists"});
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const user = await User.create({name, email, password: hashedPassword});
        const token = generateToken(user._id);
        res.status(201).json({success: true, token, user});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

// Login User
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({success: false, message: "Please fill all the fields"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        const token = generateToken(user._id);
        res.status(200).json({success: true, token, user});
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

// Get current user info
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        res.status(200).json({success: true, user});
    } catch (error) {
        console.error("Error getting current user:", error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}
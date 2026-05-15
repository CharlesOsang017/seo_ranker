import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    try {
     const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({success: false, message: "Unauthorized, no token provided"});
     }
     const token = authHeader.split(" ")[1];
     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
     req.userId = decodedToken.id;
     next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        res.status(401).json({success: false, message: "Unauthorized"});
    }
}
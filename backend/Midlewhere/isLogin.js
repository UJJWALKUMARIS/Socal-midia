import jwt from "jsonwebtoken";

/**
 * @desc Middleware to verify JWT from cookies
 */
const islogin = async (req, res, next) => {
  try {
    const token = req.cookies?.token; // Get token from cookies

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Token not found, please login again" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Invalid token payload" 
      });
    }

    req.userId = decoded.userId; // attach to request object

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    // Better error messages based on error type
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ 
        success: false,
        message: "Token expired, please login again" 
      });
    }

    return res.status(403).json({ 
      success: false,
      message: "Authentication failed" 
    });
  }
};

export default islogin;
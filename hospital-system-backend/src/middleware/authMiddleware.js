import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    let token;

    // Check authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    req.user.role = decoded.role;

    next();

  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};
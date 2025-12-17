import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    // ✅ extract actual token
    const token = authHeader.split(" ")[1];

    // ✅ check Redis session using PURE token
    const session = await redis.get(`session:${token}`);
    if (!session) {
      return res.status(401).json({ message: "Session expired" });
    }

    // ✅ verify JWT
    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

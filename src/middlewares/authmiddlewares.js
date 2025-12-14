import jwt from "jsonwebtoken";
import redis from "../config/redis.js";


export const authMiddleware = async (req, res, next) => {
try {
const token = req.headers.authorization;
if (!token) {
return res.status(401).json({ message: "No token" });
}


const session = await redis.get(`session:${token}`);
if (!session) {
return res.status(401).json({ message: "Session expired" });
}


req.user = jwt.verify(token, process.env.JWT_SECRET);
next();
} catch (err) {
res.status(401).json({ message: "Invalid token" });
}
};
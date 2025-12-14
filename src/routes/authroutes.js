import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import { authMiddleware } from "../middlewares/authmiddlewares.js";



const authroutes = express.Router();


// REGISTER
authroutes.post("/register", async (req, res) => {
const { name, email, password } = req.body;


const exists = await redis.get(`user:${email}`);
if (exists) {
return res.status(400).json({ message: "User already exists" });
}


const hash = await bcrypt.hash(password, 10);


const user = {
name,
email,
password: hash,
age: "",
dob: "",
contact: ""
};


await redis.set(`user:${email}`, JSON.stringify(user));


res.json({ message: "Registered Successfully" });
});

// LOGIN
authroutes.post("/login", async (req, res) => {
const { email, password } = req.body;


const userData = await redis.get(`user:${email}`);
if (!userData) {
return res.status(400).json({ message: "Invalid user" });
}


const user = JSON.parse(userData);
const match = await bcrypt.compare(password, user.password);


if (!match) {
return res.status(400).json({ message: "Wrong password" });
}


const token = jwt.sign({ email }, process.env.JWT_SECRET, {
expiresIn: "1d"
});


await redis.set(`session:${token}`, email);


res.json({ token });
});

// GET PROFILE
authroutes.get("/profile", authMiddleware, async (req, res) => {
const userData = await redis.get(`user:${req.user.email}`);
const user = JSON.parse(userData);
delete user.password;
res.json(user);
});

authroutes.put("/profile", authMiddleware, async (req, res) => {
  const key = `user:${req.user.email}`;

  const userData = await redis.get(key);
  if (!userData) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = JSON.parse(userData);

  const updatedUser = {
    ...user,
    ...req.body,
    education: {
      ...user.education,
      ...req.body.education
    },
    career: {
      ...user.career,
      ...req.body.career
    },
    links: {
      ...user.links,
      ...req.body.links
    }
  };

  await redis.set(key, JSON.stringify(updatedUser));

  res.json({
    message: "Profile Updated Successfully",
    user: updatedUser
  });
});



export default authroutes;
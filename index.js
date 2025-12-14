import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authroutes from "./src/routes/authroutes.js";



dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


app.use("/api", authroutes);


app.listen(process.env.PORT, () => {
console.log("Server running on port", process.env.PORT);
});
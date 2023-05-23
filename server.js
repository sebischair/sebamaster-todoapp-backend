import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;

import userRoutes from "./routes/userRoutes.js";

// connect to MongoDB
try {
  const connectDB = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to MongoDB host ${connectDB.connection.host}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));

// app.get("/", (req, res) => {
//   res.send("Hello there! Server up and running!!!!!");
// });

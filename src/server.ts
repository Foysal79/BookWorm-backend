import express, { Request, Response } from "express";
import { Server } from "http";
import mongoose from "mongoose";
let server: Server;

const app = express();
const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin-79:68815456@cluster0.haioro2.mongodb.net/bookwoormbackend?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("connected to DB!");
    server = app.listen(5000, () => {
      console.log("Server is listening to port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to book management system backend",
  });
});

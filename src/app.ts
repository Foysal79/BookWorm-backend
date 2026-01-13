import express, { Application, Request, Response } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from "./app/routes";

const app: Application = express();
// parser
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5000"] }));

// application router
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.send("welcome to BookWorm!");
});

console.log(process.cwd());
export default app;

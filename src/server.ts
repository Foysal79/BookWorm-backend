
import express, { Request, Response } from "express";
import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    app.listen(config.Port, () => {
      console.log(`Example app is listening on port ${config.Port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

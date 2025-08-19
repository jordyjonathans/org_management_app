import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRouter from "./routes/auth";
import { MysqlConnection } from "./db/mysqlConnection";
import memberRouter from "./routes/member";

async function main() {
  try {
    const PORT = process.env.PORT!;
    await MysqlConnection.connect();

    const app = express();

    // Middleware
    app.use(morgan("dev"));
    app.use(cors());
    app.use(express.json());

    // Routers
    app.use("/v1/auth", authRouter);
    app.use("/v1/member", memberRouter);

    app.listen(PORT, () => {
      console.log(`Server is running on Port : ${PORT}`);
    });
  } catch (ex) {
    console.log(`Failed to connect : ${ex}`);
  }
}

main();

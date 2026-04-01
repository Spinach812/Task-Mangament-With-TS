import express, { Express, Request, Response } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import { Task } from "./api/v1/models/task.model";
import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();

const app: Express = express();
const port: number | string = process.env.port || 3000;

database.connect();

app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });

  res.json(tasks);
});

mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

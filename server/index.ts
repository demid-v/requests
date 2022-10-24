import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { startDb, selectAllOrders } from "./database";

dotenv.config();

const app: Express = express();

function setHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  return next();
}

app.use(
  setHeaders,
  express.json({
    limit: "1mb",
  }),
  express.text({
    limit: "1mb",
  }),
  express.urlencoded({
    extended: true,
  })
);

const port = process.env.PORT;
let collectionOrder: any;

app.get("/orders", async (_req: Request, res: Response) => {
  const data = await selectAllOrders(collectionOrder);

  res.send(data);
});

app.post("/form-config", async (req: Request, res: Response) => {
  console.log(req.body);

  res.send(req.body);
});

app.listen(port, async () => {
  collectionOrder = await startDb();
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

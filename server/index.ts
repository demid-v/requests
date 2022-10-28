import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import OrdersDb from "./database";
import setRoutes from "./routes/routesConfig";

dotenv.config();

const app: Express = express();

function setHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Methods", "*");

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

const ordersDb: OrdersDb = new OrdersDb();

ordersDb.startDb().then(() => {
  setRoutes(app, ordersDb);

  app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
  });
});

import { Express, Request, Response } from "express";
import OrdersDb from "../database";

function setOrdersRoutes(app: Express, orderDb: OrdersDb) {
  app.get("/orders", async (_req: Request, res: Response) => {
    const data = await orderDb.selectAllOrders();

    res.send(data);
  });

  app.post("/orders", async (req: Request, res: Response) => {
    console.log(req.body);

    res.send(req.body);
  });
}

export default setOrdersRoutes;

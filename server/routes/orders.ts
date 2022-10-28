import { Express, Request, Response } from "express";
import OrdersDb from "../database";

function setOrdersRoutes(app: Express, ordersDb: OrdersDb) {
  app.get("/orders", async (_req: Request, res: Response) => {
    const data = await ordersDb.selectAllOrders();

    res.send(data);
  });

  app.post("/orders", async (req: Request, res: Response) => {
    console.log(req.body);

    res.send(req.body);
  });

  app.post("/order", async (req: Request, res: Response) => {
    console.log(req.body);
    const data = await ordersDb.patchOrder(req.body);

    res.send(data);
  });
}

export default setOrdersRoutes;

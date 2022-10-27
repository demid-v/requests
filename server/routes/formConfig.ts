import { Express, Request, Response } from "express";
import OrdersDb from "../database";

function setFormConfigRoutes(app: Express, ordersDb: OrdersDb) {
  app.get("/form-config", async (_req: Request, res: Response) => {
    const data = await ordersDb.selectFormStructure();

    res.send(data);
  });

  app.post("/form-config", async (req: Request, res: Response) => {
    console.log(req.body);
    const data = await ordersDb.insertFormStructure(req.body);

    res.send(data);
  });
}

export default setFormConfigRoutes;

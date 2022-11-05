import { Express, Request, Response } from "express";
import RequestsDb from "../database";

function setFormConfigRoutes(app: Express, requestsDb: RequestsDb) {
  app.get("/form-config", async (_req: Request, res: Response) => {
    const data = await requestsDb.selectFormStructure();

    res.send(data);
  });

  app.post("/form-config", async (req: Request, res: Response) => {
    console.log(req.body);
    const data = await requestsDb.insertFormStructure(req.body);

    res.send(data);
  });
}

export default setFormConfigRoutes;

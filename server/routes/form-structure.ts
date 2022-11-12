import { Express, Request, Response } from "express";
import RequestsDb from "../database";

function setFormStructureRoutes(app: Express, requestsDb: RequestsDb) {
  app.get("/form-structure", async (_req: Request, res: Response) => {
    const data = await requestsDb.getFormStructure();

    res.send(data);
  });

  app.post("/form-structure", async (req: Request, res: Response) => {
    console.log(req.body);
    const data = await requestsDb.postFormStructure(req.body);

    res.send(data);
  });
}

export default setFormStructureRoutes;

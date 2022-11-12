import { Express, Request, Response } from "express";
import RequestsDb from "../database";

function setRequestsRoutes(app: Express, requestsDb: RequestsDb) {
  app.get("/requests", async (_req: Request, res: Response) => {
    const data = await requestsDb.getRequests();

    res.send(data);
  });

  app.post("/request", async (req: Request, res: Response) => {
    console.log(req.body);
    const data = await requestsDb.postRequest(req.body);

    res.send(data);
  });

  app.patch("/request", async (req: Request, res: Response) => {
    console.log(req.body);
    const data = await requestsDb.patchRequest(req.body);

    res.send(data);
  });
}

export default setRequestsRoutes;

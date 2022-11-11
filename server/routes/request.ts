import { Express, Request, Response } from "express";
import RequestsDb from "../database";

function setRequestsRoutes(app: Express, requestsDb: RequestsDb) {
  app.get("/requests", async (_req: Request, res: Response) => {
    const data = await requestsDb.selectAllRequests();

    res.send(data);
  });

  app.post("/requests", async (req: Request, res: Response) => {
    console.log(req.body);

    res.send(req.body);
  });

  app.post("/request", async (req: Request, res: Response) => {
    console.log(req.body);
    const data = await requestsDb.patchRequest(req.body);

    res.send(data);
  });

  app.patch("/request", async (req: Request, res: Response) => {
    console.log(req.body);
    // const data = await requestsDb.patchRequest(req.body);

    res.send(req.body);
  });
}

export default setRequestsRoutes;

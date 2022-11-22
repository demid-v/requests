import { Express, Request, Response } from "express";
import RequestsDb from "../database";

function setFormStructureRoutes(app: Express, requestsDb: RequestsDb) {
  app.get("/form-structure", async (_req: Request, res: Response) => {
    const data = await requestsDb.getFormStructure();

    res.send(data);
  });

  app.post("/form-structure", async (req: Request, res: Response) => {
    const fields = req.body;
    console.log(fields);

    const promises: Promise<any>[] = [];

    fields.forEach((field: any) => {
      if (field[1] === "post") {
        promises.push(requestsDb.postFormStructure(field[0]));
      } else if (field[1] === "patch") {
        promises.push(requestsDb.patchFormStructure(field[0]));
      } else if (field[1] === "put") {
        promises.push(requestsDb.putFormStructure(field[0]));
      } else {
        throw new Error("Unknown request type.");
      }
    });

    const data = await Promise.all(promises);

    res.send(data);
  });
}

export default setFormStructureRoutes;

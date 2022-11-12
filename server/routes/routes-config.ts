import { Express } from "express";
import RequestsDb from "../database";
import setFormStructureRoutes from "./form-structure";
import setRequestsRoutes from "./request";

function setRoutes(app: Express, requestsDb: RequestsDb) {
  setRequestsRoutes(app, requestsDb);
  setFormStructureRoutes(app, requestsDb);
}

export default setRoutes;

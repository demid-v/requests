import { Express } from "express";
import RequestsDb from "../database";
import setFormConfigRoutes from "./form-config";
import setRequestsRoutes from "./request";

function setRoutes(app: Express, requestsDb: RequestsDb) {
  setRequestsRoutes(app, requestsDb);
  setFormConfigRoutes(app, requestsDb);
}

export default setRoutes;

import { Express } from "express";
import OrdersDb from "../database";
import setFormConfigRoutes from "./formConfig";
import setOrdersRoutes from "./orders";

function setRoutes(app: Express, orderDb: OrdersDb) {
  setOrdersRoutes(app, orderDb);
  setFormConfigRoutes(app, orderDb);
}

export default setRoutes;

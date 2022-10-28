import { Express } from "express";
import OrdersDb from "../database";
import setFormConfigRoutes from "./formConfig";
import setOrdersRoutes from "./orders";

function setRoutes(app: Express, ordersDb: OrdersDb) {
  setOrdersRoutes(app, ordersDb);
  setFormConfigRoutes(app, ordersDb);
}

export default setRoutes;

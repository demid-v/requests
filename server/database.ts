const mongoose = require("mongoose");

async function startDb() {
  await mongoose.connect("mongodb://localhost:27017/orders");

  const collectionOrder = mongoose.model(
    "Orders",
    new mongoose.Schema(),
    "order"
  );

  return collectionOrder;
}

async function selectAllOrders(collectionOrder: any) {
  const data = await collectionOrder.find({});

  return data;
}

const db = { startDb, selectAllOrders };

export = db;

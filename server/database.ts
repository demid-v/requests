const mongoose = require("mongoose");

class OrdersDb {
  private collectionOrder: any;
  private collectionFormStructure: any;

  async startDb() {
    await mongoose.connect("mongodb://localhost:27017/orders");

    this.collectionOrder = mongoose.model(
      "Orders",
      new mongoose.Schema({}, { strict: false }),
      "order"
    );

    this.collectionFormStructure = mongoose.model(
      "FormStructure",
      new mongoose.Schema({}, { strict: false }),
      "form_structure"
    );
  }

  async selectAllOrders() {
    const data = await this.collectionOrder.find({});

    return data;
  }

  async selectFormStructure() {
    const data = await this.collectionFormStructure.find({});

    return data;
  }

  async insertFormStructure(obj: any) {
    await this.collectionFormStructure.deleteMany({});

    const data = await this.collectionFormStructure.create(obj);

    return data;
  }
}

export default OrdersDb;

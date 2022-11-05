const mongoose = require("mongoose");

class RequestsDb {
  private collectionRequest: any;
  private collectionFormStructure: any;

  async startDb() {
    await mongoose.connect("mongodb://localhost:27017/requests");

    this.collectionRequest = mongoose.model(
      "Requests",
      new mongoose.Schema({}, { strict: false }),
      "request"
    );

    this.collectionFormStructure = mongoose.model(
      "FormStructure",
      new mongoose.Schema({}, { strict: false }),
      "formStructure"
    );
  }

  async selectAllRequests() {
    const data = await this.collectionRequest.find({});

    return data;
  }

  async selectFormStructure() {
    const data = await this.collectionFormStructure.find({}).sort("index");

    return data;
  }

  async insertFormStructure(obj: any) {
    await this.collectionFormStructure.deleteMany({});

    const data = await this.collectionFormStructure.create(obj);

    return data;
  }

  async patchRequest(obj: any) {
    const data = await this.collectionRequest.create({ fields: obj });

    return data;
  }
}

export default RequestsDb;

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

  async getRequests() {
    const data = await this.collectionRequest.find({});

    return data;
  }

  async postRequest(obj: any) {
    const data = await this.collectionRequest.updateOne(
      { _id: obj._id },
      { $set: { fields: obj.fields } }
    );

    return data;
  }

  async patchRequest(obj: any) {
    const data = await this.collectionRequest.updateOne(
      { _id: obj._id },
      { $set: { fields: obj.fields } }
    );

    return data;
  }

  async getFormStructure() {
    const data = await this.collectionFormStructure.find().sort("index");

    return data;
  }

  async postFormStructure(obj: any) {
    const data = await this.collectionFormStructure.create(obj);

    return data;
  }

  async patchFormStructure(obj: any) {
    const data = await this.collectionFormStructure.updateOne(
      { _id: obj._id },
      { $set: obj }
    );

    return data;
  }

  async putFormStructure(obj: any) {
    await this.collectionFormStructure.deleteOne({ _id: obj._id });
    const data = await this.collectionFormStructure.create(obj);

    return data;
  }

  async deleteFormStructure(obj: any) {
    const data = await this.collectionFormStructure.deleteOne({ _id: obj._id });

    return data;
  }
}

export default RequestsDb;

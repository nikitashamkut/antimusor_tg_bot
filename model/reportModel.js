import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
  trashType: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  geo: {
    type: String,
    required: true,
  },
});

const reportModel = mongoose.model("report", reportSchema);

export default reportModel;

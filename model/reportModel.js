import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  location: {
    type: { String },
    required: true,
  },
  photo: {
    type: [Object],
    required: true,
  },
  userComment: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  video: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: "new",
  },
  admin: {
    type: String,
    default: "defaultAdmin",
  },
  adminComment: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "nizhny-novgorod",
  },
});

const reportModel = mongoose.model("report", reportSchema);

export default reportModel;

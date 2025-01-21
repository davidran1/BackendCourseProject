import mongoose, { Schema } from "mongoose";

//Define the schema for cost collection
const costSchema = new Schema({
  description: { type: String, required: true },
  sum: { type: Number, required: true },
  category: {
    type: String,
    enum: ["food", "health", "housing", "sport", "education"],
    required: true,
  },
  date: { type: Date, required: true },
  user: { type: Number, required: true },
});

const CostModel = mongoose.model("Cost", costSchema);
export default CostModel;

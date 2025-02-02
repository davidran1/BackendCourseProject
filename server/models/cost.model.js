import mongoose, { Schema } from "mongoose";

/**
 * Cost Schema Definition
*/
const costSchema = new Schema({
  // Description of the cost item
  description: {type: String, required: true},
  
  // Amount of the cost
  sum: {type: Number, required: true},
  
  // Category of the cost
  // Limited to predefined set of values
  category: {type: String, enum: ["food", "health", "housing", "sport", "education"], required: true},
  
  // Date when the cost occurred
  date: {type: Date, required: true},
  
  // Reference to the user who made the cost
  userid: {type: Number, required: true },
});

const CostModel = mongoose.model("Cost", costSchema);

export default CostModel;
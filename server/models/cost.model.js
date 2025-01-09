//The costs collection should hold documents that (at the minimum) include the
//  following properties: description and sum.
import mongoose, { Schema } from "mongoose";

const costSchema = new Schema({
    description: { type: String, required: true },
    sum: { type: Number, required: true },
    });

    const CostModel = mongoose.model("Cost", costSchema);
    export default CostModel;
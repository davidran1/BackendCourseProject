//The users collection should hold documents that (at the minimum)
//  include the following properties: id, first_name, last_name, birthday,
//  and marital_status.
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    id: { type: Number, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: String, required: true },
    marital_status: { type: String, required: true },
    });

    const UserModel = mongoose.model("User", userSchema);
    export default UserModel;
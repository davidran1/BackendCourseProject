import mongoose, { Schema } from "mongoose";

//Define the schema for user collection
const userSchema = new Schema({
  id: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birthday: { type: Date, required: true },
  marital_status: { type: String, required: true },
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;

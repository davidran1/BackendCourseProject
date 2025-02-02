import mongoose, { Schema } from "mongoose";

/**
 * User Schema Definition
 */

/**
 * Mongoose schema for storing user information
 */
const userSchema = new Schema({
  // Unique identifier for the user
  id: {type: Number, required: true, unique: true},
  
  // User's first name
  first_name: {type: String, required: true},
  
  // User's last name
  last_name: {type: String, required: true},
  
  // User's date of birth
  birthday: {type: Date, required: true},
  
  // User's marital status
  marital_status: {type: String, required: true},
});

/**
 * Mongoose model for User collection
 */
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
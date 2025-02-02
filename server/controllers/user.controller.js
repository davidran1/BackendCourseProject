// Import required models
import UserModel from "../models/user.model.js";
import CostModel from "../models/cost.model.js";

/**
 * Retrieves user information and calculates total costs
 * @async
 * @function getUser
 */
export const getUser = async (req, res) => {
  try {
    // Convert user ID to number
    const id = parseInt(req.params.id);
    
    // Check if user exists
    const userExist = await UserModel.findOne({ id:id });
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get all costs for user
    const userCosts = await CostModel.find({ userid: id });
    
    // Calculate total cost
    let totalCost = 0;
    for (let i = 0; i < userCosts.length; i++) {
      totalCost += userCosts[i].sum;
    }

    // Return user details with total costs
    return res.status(200).json({
      success: true,
      first_name: userExist.first_name,
      last_name: userExist.last_name,
      total_costs: totalCost,
    });
  } catch (error) {
    // Return error if any operation fails
    return res.status(500).json({
      success: false,
      message: "Error getting user total cost",
      error: error.message,
    });
  }
};

/**
 * Adds a new user to the database - Not required for the project
 * @async
 * @function addUser
 */
export const addUser = async (req, res) => {
  try {
    // Extract user details from request body
    const { id, first_name, last_name, birthday, marital_status } = req.body;
    
    // Convert and validate birthday
    const userBirthday = new Date(birthday);
    if (isNaN(userBirthday.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // Check if user already exists
    const findUser = await UserModel.findOne({ id: id });
    if (findUser) {
      return res.status(400).send("User already exists");
    }

    // Create new user instance
    const user = new UserModel({id,first_name,last_name,birthday: userBirthday,marital_status,});

    // Save user to database
    await user.save();

    // Return success response with saved user
    return res.status(200).json({
      success: true,
      message: "User added successfully",
      user,
    });
  } catch (error) {
    // Return error if any operation fails
    return res.status(500).json({
      success: false,
      message: "Error adding user",
      error: error.message,
    });
  }
};
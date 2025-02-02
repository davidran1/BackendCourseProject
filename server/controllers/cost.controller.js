// Import required models for cost and user operations
import CostModel from "../models/cost.model.js";
import UserModel from "../models/user.model.js";

/**
 * Adds a new cost item to the database
 * @async
 * @function addCost
 */
export const addCost = async (req, res) => {
  try {
    // Extract all required fields from request body
    const { description, sum, category, year, month, day, userid } = req.body;
    
    // Create a date object for the cost (month-1 because JavaScript months are 0-based)
    let costDate = new Date(year, month - 1, day);
    
    // If date is invalid, use current date
    if (isNaN(costDate.getTime())) {
      costDate = new Date();
    }

    // Check if user exists in database
    const userExist = await UserModel.findOne({ id: userid });
    
    // Return error if user not found
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create new cost instance with provided data
    const cost = new CostModel({description,sum,category,date: costDate,userid,});

    // Save the cost to database
    await cost.save();

    // Return success response with saved cost details
    return res.status(200).json({
      success: true,
      message: "Cost added successfully",
      cost,
    });
  } catch (error) {
    // Return error response if any operation fails
    return res.status(500).json({
      success: false,
      message: "Error adding cost",
      error: error.message,
    });
  }
};

/**
 * Retrieves cost report for a specific user, year, and month
 * @async
 * @function getCostReport
 */
export const getCostReport = async (req, res) => {
  try {
    // Extract query parameters
    const { id, year, month } = req.query;

    // Validate that required fields are provided
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }

    // Convert month to number and validate range
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month. Month should be between 1 and 12",
      });
    }

    // Verify user exists in database
    const user = await UserModel.findOne({ id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate start and end dates for the requested month
    // Using UTC to avoid timezone issues
    const startDate = new Date(Date.UTC(year, month-1, 1, 0, 0, 0));  // First day of month
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));   // Last day of month

    // Find all costs for user within date range
    const userCosts = await CostModel.find({userid: id,date: {$gte: startDate,$lte: endDate,}});

    // Initialize object to store costs by category
    const costsByCategory = {"food": [],"health": [],"housing": [],"sport": [],"education": []};

    // Organize costs into their categories
    userCosts.forEach(cost => {
      costsByCategory[cost.category].push({
        day: cost.date.getDate(),
        description: cost.description,
        sum: cost.sum
      });
    }); 
    
     //Option two - array of elements
    /*
    const costsByCategory = [{ food: [] },{ health: [] },{ housing: [] },{ sport: [] },{ education: [] }];

userCosts.forEach(cost => {
    const categoryObject = costsByCategory.find(obj => obj.hasOwnProperty(cost.category));
    if (categoryObject) {
        categoryObject[cost.category].push({
            day: cost.date.getDate(),
            description: cost.description,
            sum: cost.sum
        });
    }
    */

    // Return organized cost report
    return res.status(200).json({
      success: true,
      userid: id,
      year: parseInt(year),
      month: monthNum,
      costs: costsByCategory
    });
  } catch (error) {
    // Return error if any operation fails
    return res.status(500).json({
      success: false,
      message: "Error getting user costs",
      error: error.message,
    });
  }
};
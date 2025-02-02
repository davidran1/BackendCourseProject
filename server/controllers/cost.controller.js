import MonthlyReportModel from "../models/monthlyReport.model.js";
import UserModel from "../models/user.model.js";
import CostModel from "../models/cost.model.js";


/**
 * This function add a new cost item to the database and updates the user's monthly report
 * with the new cost item , if the report exists. If the report does not exist,
 * a new report is created with the new cost item.(computed pattern).
 * @async
 * @function addCost
 */
export const addCost = async (req, res) => {
  try {
    // Destructuring request body for cost details
    const { description, sum, category, userid } = req.body;
    let { year, month, day } = req.body;
    
    // Try to create a date object from the provided year, month, and day
    let costDate = new Date(year, month - 1, day);// month is 0-indexed
     // If the date is invalid set it to the current date
    if (isNaN(costDate.getTime())) {
      costDate = new Date(); // Get the current date
      year = costDate.getFullYear();// Update year to current year
      month = costDate.getMonth() + 1; // Update month to current month
      day = costDate.getDate();// Update day to the current day
    }

     // Check if the user exists in the database
    const userExist = await UserModel.findOne({ id: userid });
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Save the cost to the costs collection
    const cost = new CostModel({description,sum,category,date: costDate,userid});
    await cost.save();

    // Try to find existing monthly report for the user, year, and month
    let monthlyReport = await MonthlyReportModel.findOne({userid: userid,year:year,month:month});

    //New cost item to add to the report
    const newCostItem = {day,description,sum};

    if (monthlyReport) {
      // Update existing report , if it exists
      monthlyReport.costs[category].push(newCostItem);
      await monthlyReport.save();
    } else {
      // Create new report with initial data, if it does not exist
      const initialCosts = {food: [],health: [],housing: [],sport: [],education: []};
      initialCosts[category].push(newCostItem);// Add the new cost to the correct category
      // Create a new monthly report and save it to the database
      monthlyReport = new MonthlyReportModel({userid,year: year,month: month,costs: initialCosts});
      await monthlyReport.save();
    }
    // Return a success response with the added cost data
    return res.status(200).json({
      success: true,
      message: "Cost added successfully",
      cost,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding cost",
      error: error.message,
    });
  }
};

/**
 * This function return the cost report for a specific user, year, and month.
 * @async
 * @function getCostReport
 */
export const getCostReport = async (req, res) => {
  try {
    // Extracting id, year, and month from the query parameters
    const { id, year, month } = req.query;

    // Validate that year and month provided
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }
   //Validate month
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month. Month should be between 1 and 12",
      });
    }
    // Validate that the user exists by id
    const user = await UserModel.findOne({ id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Try to find the monthly report for the given user, year, and month
    const monthlyReport = await MonthlyReportModel.findOne({userid: id,year: parseInt(year),month: monthNum});
    // Default empty categories in case the report doesn't exist
    const emptyCategories = {food: [],health: [],housing: [],sport: [],education: []};

    // If monthlyReport exists, insert the cost items without the _id field
    const costs = monthlyReport ? {
      food: monthlyReport.costs.food.map(({ day, description, sum }) => ({ day, description, sum })),
      health: monthlyReport.costs.health.map(({ day, description, sum }) => ({ day, description, sum })),
      housing: monthlyReport.costs.housing.map(({ day, description, sum }) => ({ day, description, sum })),
      sport: monthlyReport.costs.sport.map(({ day, description, sum }) => ({ day, description, sum })),
      education: monthlyReport.costs.education.map(({ day, description, sum }) => ({ day, description, sum }))
    } : emptyCategories;// Use empty categories if no report found

    return res.status(200).json({
      success: true,
      userid: id,
      year: parseInt(year),
      month: monthNum,
      costs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting user costs",
      error: error.message,
    });
  }
};
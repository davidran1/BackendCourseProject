import CostModel from "../models/cost.model.js";
import UserModel from "../models/user.model.js";

//This function will add new cost item
export const addCost = async (req, res) => {
  try {
    const { description, sum, category, year, month, day, userid } = req.body;
    let costDate = new Date(year, month - 1, day);
    if (isNaN(costDate.getTime())) {
      costDate = new Date();
    }

    const userExist = await UserModel.findOne({ userid: userid });
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const cost = new CostModel({
      description,
      sum,
      category,
      date: costDate,
      userid,
    });
    await cost.save();
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

//This function will return cost report by year and month and specific user
export const getCostReport = async (req, res) => {
  try {
    const { id, year, month } = req.query;

    // Validate year and month
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }

    // Convert month to number and validate
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month. Month should be between 1 and 12",
      });
    }

    //Validate that the user exist
    const user = await UserModel.findOne({ userid: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate start and end dates for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    // Find costs for the specific user within the date range
    const userCosts = await CostModel.find({
      userid: id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const costsByCategory = {};

    //add all the categories that exist in the db to costsByCategory object
    userCosts.forEach(cost => {
      if (!costsByCategory[cost.category]) {
        costsByCategory[cost.category] = [];
      }

      costsByCategory[cost.category].push({
        day: cost.date.getDate(),
        description: cost.description,
        sum: cost.sum
      });
    });

    const categories = Object.keys(costsByCategory).map(category => ({
      category: category,
      items: costsByCategory[category]
    }));
    

    return res.status(200).json({
      success: true,
      report: {
        userid: id,
        year: parseInt(year),
        month: monthNum,
        categories: categories
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error geting user costs",
      error: error.message,
    });
  }
};

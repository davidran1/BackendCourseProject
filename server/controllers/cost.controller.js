import CostModel from "../models/cost.model.js";
import UserModel from "../models/user.model.js";
export const addCost = async (req, res) => {
  try {
    const { description, sum, category, date, user } = req.body;
    const costDate = new Date(date);
    if (isNaN(costDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }
    const userExist = await UserModel.findOne({ id:user });
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
      user,
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

export const getCostReport = async(req, res) => {
    try {
        const { id ,year, month } = req.query;

        // Validate year and month
        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: "Year and month are required"
            });
        }

        // Convert month to number and validate
        const monthNum = parseInt(month);
        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).json({
                success: false,
                message: "Invalid month. Month should be between 1 and 12"
            });
        }

        // Find user
        const user = await UserModel.findOne({ id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Calculate start and end dates for the month
        const startDate = new Date(year, month - 1,1);
        const endDate = new Date(year, month, 0);
        // Find costs for the specific user within the date range
        const userCosts = await CostModel.find({
            user: id,
            date: {
                $gte: startDate,
                $lte: endDate

            }
        });

        return res.status(200).json({
            success: true,
            report: {
                user: id,
                year: parseInt(year),
                month: monthNum,
                costs: userCosts
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error geting user costs",
            error: error.message
        });
    }
};

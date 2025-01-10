import CostModel from "../models/cost.model.js";
export const addCost = async (req, res) => {
    try{
        const{ description, sum, category, date, user } = req.body;
        const cost = new CostModel({ description, sum, category, date, user });
        await cost.save();
        return res.status(200).json({
            success: true,
            message: "Cost added successfully",
            cost,
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error adding cost",
            error: error.message,
        });
    }
}

export const getCostReport =(req, res) => {
    res.send("Cost report");
    }
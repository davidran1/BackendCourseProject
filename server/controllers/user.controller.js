import UserModel from "../models/user.model.js";
import CostModel from "../models/cost.model.js";

export const getUser = async (req, res) => {
    try{
        const {id}= req.params;
        const userExist = await UserModel.findOne({id});
        if(!userExist){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const userCosts = await CostModel.find({user:id});
        console.log(userCosts);
        let totalCost=0
        for(let i =0;i < userCosts.length;i++){
            totalCost+= userCosts[i].sum;
        }
        return res.status(200).json({
            success:true,
            first_name:userExist.first_name,
            last_name:userExist.last_name,
            total_costs:totalCost
    
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "Error getting uset total cosr",
            error: error.message,

        })
    }
}
export const addUser = async (req, res) => {
    try{
        const {id,first_name,last_name,birthday,marital_status} = req.body;
        const userBirthday = new Date(birthday);
        if (isNaN(userBirthday.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format",
            });
        }
        const user = new UserModel({id,first_name,last_name,birthday:userBirthday,marital_status});
        const findUser = await UserModel.findOne({id});
        if(findUser){
            return res.status(400).send("User already exists");
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: "User added successfully",
            user,
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error adding user",
            error: error.message,
        });  
    }
} 
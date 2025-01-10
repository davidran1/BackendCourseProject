import UserModel from "../models/user.model.js";

export const getUser = (req, res) => {
    res.send("User details");
    }
export const addUser = async (req, res) => {
    try{
        const {id,first_name,last_name,birthday,marital_status} = req.body;
        const user = new UserModel({id,first_name,last_name,birthday,marital_status});
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
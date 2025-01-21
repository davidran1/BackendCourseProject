//Hbe1SWQY0Nh1Oz7Q
//davidofir
//mongodb+srv://davidofir:Hbe1SWQY0Nh1Oz7Q@backendproject.bxtks.mongodb.net/
import mongoose from 'mongoose';
const URL = "mongodb+srv://davidofir:Hbe1SWQY0Nh1Oz7Q@backendproject.bxtks.mongodb.net/";

//This function will make the connection to DB when start the server
export const connectDB = async () => {
  try {
    await mongoose.connect(URL).then(()=>{
        console.log("Connected to the database");
    });
  } catch (error) {
    console.log("Error connecting to the database: ", error);
  }
}


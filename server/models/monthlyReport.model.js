import mongoose from 'mongoose';
/**
 * Schema definition for MonthlyReport.(Computed pattern)
 * Represents the cost report for a specific user, year, and month, including various categories of costs.
 */
const MonthlyReportSchema = new mongoose.Schema({
  userid: {type: String,required: true},
   // Year of the report
  year: {type: Number,required: true},
  // Month of the report 
  month: {type: Number,required: true},
  // Costs object by categories(food, health, housing, sport, education)
  costs: {food: [{day: Number,description: String,sum: Number}],
  health: [{day: Number,description: String,sum: Number}],
  housing: [{day: Number,description: String,sum: Number}],
  sport: [{day: Number,description: String,sum: Number}],
  education: [{day: Number,description: String,sum: Number}]},
},);

export default mongoose.model('MonthlyReport', MonthlyReportSchema);
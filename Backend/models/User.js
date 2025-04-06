// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  preferences: {
    goal: String,
    age: Number,
    height: Number,
    weight: Number,
    workoutType: String,
    experience: String,
    diet: String,
    allergies: String,
  },
  dailyCalories: Number,
  stepsToday: { type: Number, default: 0 },
  caloriesBurnedToday: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);

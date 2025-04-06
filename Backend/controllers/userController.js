const User = require('../models/User');

//  Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json(user);
  } catch (err) {
    console.error(" Get Profile Error:", err);
    res.status(500).json({ message: 'Server error.' });
  }
};

//  Save onboarding preferences & calculate calories
const saveUserPreferences = async (req, res) => {
  try {
    const {
      goal, age, height, weight,
      workoutType, experience, diet, allergies
    } = req.body;

    // Calculate daily calories using Mifflin-St Jeor Equation (for males)
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    const activityFactor = goal === 'lose fat' ? 1.2 : 1.55;
    const dailyCalories = Math.round(bmr * activityFactor);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        preferences: {
          goal,
          age,
          height,
          weight,
          workoutType,
          experience,
          diet,
          allergies,
        },
        dailyCalories,
      },
      { new: true }
    );

    res.json({ message: 'Preferences saved', dailyCalories });
  } catch (err) {
    console.error(" Save Preferences Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

//  Generate workout plan based on goal
//  Generate structured workout plan based on goal
const getWorkoutPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.preferences?.goal) {
      return res.status(400).json({ error: 'User goal not found' });
    }

    let plan = [];

    switch (user.preferences.goal.toLowerCase()) {
      case 'lose weight':
        plan = [
          { day: 'Monday', type: 'Jumping Jacks', duration: '3 sets' },
          { day: 'Tuesday', type: 'Mountain Climbers', duration: '3 sets' },
          { day: 'Wednesday', type: 'Burpees', duration: '3 sets' },
        ];
        break;

      case 'build muscle':
        plan = [
          { day: 'Monday', type: 'Push-ups', duration: '4 sets' },
          { day: 'Tuesday', type: 'Squats', duration: '4 sets' },
          { day: 'Wednesday', type: 'Dumbbell Press', duration: '3 sets' },
        ];
        break;

      case 'stay fit':
      case 'maintain':
        plan = [
          { day: 'Monday', type: 'Plank', duration: '3 sets (1 min)' },
          { day: 'Tuesday', type: 'Jogging', duration: '20 minutes' },
          { day: 'Wednesday', type: 'Bodyweight Squats', duration: '3 sets' },
        ];
        break;
    }

    res.json({ plan }); // send structured array
  } catch (err) {
    console.error(" Workout Plan Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Generate meal plan based on goal
const getMealPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.preferences?.goal) {
      return res.status(400).json({ error: 'User goal not found' });
    }

    let meals = [];

    switch (user.preferences.goal) {
      case 'lose fat':
        meals = [
          { time: 'Breakfast', food: 'Oatmeal + banana' },
          { time: 'Lunch', food: 'Grilled chicken + veggies' },
          { time: 'Dinner', food: 'Boiled eggs + salad' },
        ];
        break;

      case 'build muscle':
        meals = [
          { time: 'Breakfast', food: 'Eggs + peanut butter toast' },
          { time: 'Lunch', food: 'Rice + chicken + lentils' },
          { time: 'Dinner', food: 'Protein shake + paneer' },
        ];
        break;

      case 'maintain':
        meals = [
          { time: 'Breakfast', food: 'Fruit bowl + yogurt' },
          { time: 'Lunch', food: 'Balanced plate: rice, dal, veggies' },
          { time: 'Dinner', food: 'Roti + sabji + boiled egg' },
        ];
        break;

      default:
        meals = [];
    }

    res.json({ goal: user.preferences.goal, meals });
  } catch (err) {
    console.error(" Meal Plan Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};



//  Function to handle day completion (for workout or meal)
const completeDay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.dailyCalories) {
      return res.status(400).json({ error: 'User or calories not found' });
    }

    let caloriesSpent = 0;

    if (type === 'workout') {
      caloriesSpent = 250;
    } else if (type === 'meal') {
      caloriesSpent = -200;
    }

    user.dailyCalories = Math.max(user.dailyCalories - caloriesSpent, 0);
    await user.save();

    res.json({ message: 'Day submitted', updatedCalories: user.dailyCalories });
  } catch (err) {
    console.error('completeDay Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const updateSteps = async (req, res) => {
  try {
    const { steps } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const caloriesBurned = steps * 0.04; // basic conversion
    user.stepsToday = steps;
    user.caloriesBurnedToday = Math.round(caloriesBurned);

    await user.save();

    res.json({
      message: 'Steps updated',
      stepsToday: steps,
      caloriesBurnedToday: Math.round(caloriesBurned),
      caloriesGoal: user.dailyCalories,
      caloriesLeft: Math.max(user.dailyCalories - caloriesBurned, 0),
    });
  } catch (err) {
    console.error(' Step Update Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
module.exports = {
  getUserProfile,
  saveUserPreferences,
  getWorkoutPlan,
  getMealPlan,
  updateSteps,
  completeDay,
};

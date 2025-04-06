// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

const {
  getUserProfile,
  saveUserPreferences,
  getWorkoutPlan,
  getMealPlan,
  updateSteps,
  completeDay,
} = require('../controllers/userController');

//  Authenticated Routes
router.get('/profile', authenticate, getUserProfile);
router.post('/onboarding', authenticate, saveUserPreferences);
router.get('/workout-plan', authenticate, getWorkoutPlan);
router.get('/meal-plan', authenticate, getMealPlan);
router.post('/steps', authenticate, updateSteps);          
router.post('/complete-day', authenticate, completeDay);   

module.exports = router;

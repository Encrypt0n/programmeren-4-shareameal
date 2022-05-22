const express = require("express");
const authController = require("../controllers/authentication.controller");
const router = express.Router();
const mealController = require("../controllers/meal.controller");

router
    .get("/meal", mealController.getAllMeals)
    .get("/meal/:id", mealController.getMeal)
    .delete("/meal/:id", authController.validateToken, mealController.deleteMeal)
    .post("/meal", authController.validateToken, mealController.validateMeal, mealController.addMeal)
    .put("/meal/:id", authController.validateToken, mealController.validateMeal, mealController.updateMeal)



module.exports = router;
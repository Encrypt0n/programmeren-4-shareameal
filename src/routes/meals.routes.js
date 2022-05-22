const express = require("express");
const authController = require("../controllers/authentication.controller");
const router = express.Router();
const mealController = require("../controllers/meal.controller");

router.get("/api/meal", mealController.getAllMeals)
    router.get("/api/meal/:id", mealController.getMeal)
    router.delete("/api/meal/:id", authController.validateToken, mealController.deleteMeal)
    router.post("/api/meal", authController.validateToken, mealController.validateMeal, mealController.addMeal)
    router.put("/api/meal/:id", authController.validateToken, mealController.validateMeal, mealController.updateMeal)



module.exports = router;
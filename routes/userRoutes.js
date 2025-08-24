import express from "express";
import { UserController } from "../controllers/userController.js";
import { ValidationMiddleware } from "../middleware/validation.js";

const router = express.Router();

router.get("/", UserController.showHome);

router.get("/users", UserController.showUsers);
router.get("/users/search",
    ValidationMiddleware.validateSearchQuery,
    UserController.searchUsers
);
router.get("/add-user", UserController.showAddUserForm);
router.post("/add-user",
    ValidationMiddleware.validateUserInput,
    UserController.addUser
);
router.get("/users/:id",
    ValidationMiddleware.validateUserId,
    UserController.showUserDetails
);

export default router;
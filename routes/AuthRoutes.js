"use strict";
import { Router } from "express";
import { trycatch } from "../middlewares/TrycatchMiddleware.js";
import { getUserInfo, login, signup, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes= Router()
authRoutes.post("/signup",trycatch(signup))
authRoutes.post("/login",trycatch(login))
authRoutes.get("/user-info",verifyToken,trycatch(getUserInfo))
authRoutes.post("/update-profile",verifyToken,trycatch(updateProfile))


export default authRoutes
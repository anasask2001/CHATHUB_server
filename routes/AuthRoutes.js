"use strict";
import { Router } from "express";
import { trycatch } from "../middlewares/TrycatchMiddleware.js";
import { getUserInfo, login, signup, updateProfile,addProfileImage,removeProfileImage } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer"

const upload = multer({dest:"uploads/profiles/"})
const authRoutes= Router()
authRoutes.post("/signup",trycatch(signup))
authRoutes.post("/login",trycatch(login))
authRoutes.get("/user-info",verifyToken,trycatch(getUserInfo))
authRoutes.post("/update-profile",verifyToken,trycatch(updateProfile))
authRoutes.post("/add-profile-image",verifyToken,upload.single("profile-image"),trycatch(addProfileImage))
authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage)

export default authRoutes
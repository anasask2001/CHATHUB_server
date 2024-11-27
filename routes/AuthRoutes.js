"use strict";
import { Router } from "express";
import { trycatch } from "../middlewares/TrycatchMiddleware.js";
import { signup } from "../controllers/AuthController.js";

const authRoutes= Router()
authRoutes.post("/signup",trycatch(signup))

export default authRoutes
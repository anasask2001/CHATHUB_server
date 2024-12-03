"use strict";
import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {existsSync, renameSync,unlinkSync} from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "failed", message: "Email and Password is required" });
  }

  const user = await User.create({ email, password });
  res.cookie("jwt", createToken(email, user.id), {
    maxAge: maxAge,
    secure: true,
    sameSite: "None",
  });
  return res.status(201).json({
    user: { id: user.id, email: user.email, profileSetup: user.profilesetup },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "failed", message: "Email and Password is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("User with the given email not found");
  }
  const auth = await compare(password, user.password);
  if (!auth) {
    return res.status(404).send("Password is incorrect");
  }

  res.cookie("jwt", createToken(email, user.id), {
    maxAge: maxAge,
    secure: true,
    sameSite: "None",
  });
  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      profileSetup: user.profilesetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    },
  });
};

export const getUserInfo = async (req, res, next) => {
  const userData = await User.findById(req.userId);
  if (!userData)
    return res.status(404).send("User with the given id not found");

  return res.status(200).json({
    id: userData.id,
    email: userData.email,
    profileSetup: userData.profilesetup,
    firstName: userData.firstName,
    lastName: userData.lastName,
    image: userData.image,
    color: userData.color,
  });
};

export const updateProfile = async (req, res, next) => {
  const { userId }=req;
  const { firstName, lastName, color } = req.body;
  if (!firstName || !lastName )
    return res.status(400).send("firstName lastName is required");
  const userData = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, color,profilesetup:true },
    { new: true, runValidators: true }
  );
  return res.status(200).json({
    id: userData.id,
    email: userData.email,
    profilesetup: userData.profilesetup,
    firstName: userData.firstName,
    lastName: userData.lastName,
    image: userData.image,
    color: userData.color,
  });
};

export const addProfileImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("File is required");
  }

  const date = Date.now();
  const fileName = "uploads/profiles/" + date + req.file.originalname;
  if (existsSync(fileName)) {
    return res.status(400).send("File with the same name already exists.");
  }
  renameSync(req.file.path, fileName);
  const updatedUser = await User.findByIdAndUpdate(
    req.userId,
    { image: fileName },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).send("User not found.");
  }
  return res.status(200).json({
    image: updatedUser.image,
  });
};

export const removeProfileImage = async (req, res, next) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send("User not found.");
  }
  if (user.image) {
    const imagePath = user.image;
    if (existsSync(imagePath)) {
      unlinkSync(imagePath);
    } else {
      console.log("File does not exist:", imagePath);
    }
  }
  user.image = null;
  await user.save();

  return res.status(200).send("Profile image removed successfully");
};
"use strict";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"

const maxAge= 3*24*60*60*1000
const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
 
}

export const signup = async(req,res,next)=>{
    const{email,password}=req.body
    if(!email || password){
        return res.status(400).json({status:"failed",message:"Email and Password is required"})
    }
    
    const user = await User.create({email,password});
    res.cookie("jwt", createToken(email, user.id), {
        maxAge: maxAge, 
        secure: true,  
        sameSite:"None"
    });
    return res.status(201).json({user:{id:user.id,email:user.email,profileSetup:user.profilesetup}})


}
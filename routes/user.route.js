import express from 'express'
import bcrypt from 'bcrypt'
import UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken'


const userRouter = express.Router();

userRouter.get("/", async(req,res) =>{
    try{
        const userData = await UserModel.find();
        res.status(201).json({msg:`User data fetched successfully:`, userData})

    }catch(err){
        res.send(`Err occured while fetching user ${err}`)
    }
})

userRouter.post("/register", (req,res) =>{
    try{
        const{name, email, password, gender, age} = req.body;
        bcrypt.hash(password, 5, async(err, hash) =>{
            if(err){
                return res.status(500).json({msg:"Internal server error",err})
            }
            const newUser = UserModel({
                name,
                email,
                password:hash,
                gender,
                age
            })
            
            await newUser.save();
            res.status(201).json({msg:`user registerd successfully`, newUser})
        })

    }catch(err){
        res.send(`Err occured while register ${err}`)
    }
})

userRouter.post("/login", async(req,res) =>{
    const{email, password} = req.body;
    try{
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(404).json({msg:"User not found"})
        }
        if(user){
            bcrypt.compare(password, user.password, (err, result) =>{
                if(err){
                    return res.status(500).json({msg:"Internal server error"});
                }
                if(result){
                    const token = jwt.sign({id:user._id}, process.env.SECRET_KEY);
                    return res.status(200).json({msg: "User logged successfully", token})
                }else {
                    return res.status(402).json({msg:"Invalid password"})
                }
            })
        }
    }catch(err){
        res.send(`Err occured while login ${err}`)
    }
})

export default userRouter

import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const auth = async(req, res, next) =>{
  
    if(!req.headers.authorization){
        return res.status(401).json({msg:"Token not found"})
    }
    const token = req.headers.authorization.split(' ')[1];

    // if(!token) {
    //     return res.status(401).json({msg:"Token not found"});
    // }
    try{
        const decoded  = jwt.verify(token, process.env.SECRET_KEY)
        if(!decoded) {
            return res.status(401).json({msg:"Invalid token please login again"})
        }
        const user = await UserModel.findById(decoded.id)
        req.user = user
        next();

    }catch(err){
        res.status(401).json({mgs:"Invalid Token"})
    }
}

export default auth;
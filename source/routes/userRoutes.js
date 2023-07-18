const express = require('express');
const { signup, signin, info } = require('../controllers/userController');
const auth = require("../middlewares/auth")
const userModel =require("../models/user");
const profileModel = require("../models/profile")
const userRouter = express.Router();

userRouter.post("/signup",signup);

userRouter.post("/signin",signin);

userRouter.get("/info",auth,info);

module.exports = userRouter;


// .populate("user",['username']);
// (async (req,res) =>
// {
//     try{
//     // console.log(req.params.id);
//     // result = await userModel.findById(req.params.id)
    
//     const result = await profileModel.findOne({user:req.user.id})
    

//     res.status(200).json({message : result})
//     console.log(result)
//     }
//     catch(error)
//     {
//        // console.log(error);
//         res.status(500).json({message:"Something Went Wrong"});
//     }
// });

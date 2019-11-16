const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config =require("config")

router.post("/api/users", async (req,res) =>{
   const {name,email,password} = req.body;

    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg:"User already exists"});
        } 
        user = new User({
            name,
            email,
            password
        })
     //hashing password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password,salt);
      await user.save();
      const payload ={
          user:{
              id:user.id
          }
      }
      //json token 
        jwt.sign(payload,config.get("jwtSecret"),{
            expiresIn:360000
        },(err,token) =>{
           if(err) throw err;
           res.json({token});
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})


module.exports = router;
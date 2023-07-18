const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "THISISUSERAPI";

const signin = (req, res) => {

    const { email, password } = req.body;

    userModel.findOne({ email: email }, function(error, existingUser) {
        if (error) {
            return res.status(400).json({ message: "email find error" });
        }
         
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }
        bcrypt.compare(password, existingUser.password, 
            function(error, matchPassword) {
            if(matchPassword)
            {
 
             const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY, { expiresIn: '2h' });
 
             res.cookie("Token", token)
 
             res.status(200).json({ user: existingUser, token: token })
             console.log(existingUser, token)
            }
            if(!matchPassword) {
                return res.status(400).json({ message: "Invalid Credential" });
            }
            
            if(error) {
                return res.status(400).json({ message: "matchpassword error" });

            }
          
        })

    })

}
const info = (req,res)=>
{
    const userId = req.user.id;

    const userfind = function(userId,callback)
    {
        userModel.findById(userId,(err,result) =>
        {
            if(err)
            {
                callback(err,null);
            }
            else
            {
                callback(null,result);
            }
        })
    }

    function call(err,result)
    {
        if(result)
        {
            res.status(200).json({ message: result });
            console.log(result);
        }else{

            return res.status(400).json({ message: "user not found" });
        }
    }

    userfind(userId,call);

}

module.exports ={signup, signin, info };

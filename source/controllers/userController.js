const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "THISISUSERAPI";

const signup = (req, res) => {

    const { username, email, password } = req.body;

    userModel.findOne({ email: email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({ message: "User Already Exists" });
            }

            return bcrypt.genSalt(10)
                .then((salt) => {
                    if (!salt) {
                        return res.status(400).json({ message: "salt generate error" });
                    }

                    return bcrypt.hash(password, salt)
                        .then((hashedPassword) => {
                            if (!hashedPassword) {
                                return res.status(400).json({ message: "hasspassword not generate" });

                            }

                            // console.log("hello")
                            return userModel.create({
                                email: email,
                                password: hashedPassword,
                                username: username
                            })
                                .then((result) => {
                                    if (!result) {
                                        return res.status(400).json({ message: "user document not created" });

                                    }

                                    const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);
                                    console.log(result, token)

                                    res.cookie("Token", token)

                                    //res.localStorage.setItem("Token", token); 
                                    //console.log( localStorage.setItem("Token"))

                                    res.status(201).json({ user: result, token: token });

                                    //res.redirect("http://localhost:4000/info")
                                })
                                .catch((error) => {
                                    console.log(error);
                                    res.status(500).json({ message: "Something4 Went Wrong" });

                                })
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(500).json({ message: "Something3 Went Wrong" });

                        })
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({ message: "Something2 Went Wrong" });

                })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Something1 Went Wrong" });

        })
}

const signin = (req, res) => {

    const { email, password } = req.body;

    // userModel.findOne({ email: email }, function(error, existingUser) {
    //     if (error) {
    //         return res.status(400).json({ message: "email find error" });
    //     }
         
    //     if (!existingUser) {
    //         return res.status(400).json({ message: "User not found" });
    //     }
    const existingUser = email;
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

    //})
    //res.redirect("http://localhost:4000/info")
}

// const info = (req, res) => {
//     try {
//         const userId = req.user.id;

//         userModel.findById(userId,
//             function (error, result) {
//                 if (result) {
//                     res.status(200).json({ message: result })
//                     console.log(result);
//                 }
//                 else {
//                     return res.status(400).json(error,{ message: "user not found" });
//                 }
//             });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Something Went Wrong" });
//     }

// }
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






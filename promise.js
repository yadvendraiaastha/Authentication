const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "THISISUSERAPI";

const signup = (req, res) => {

    const { username, email, password } = req.body;
try{
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
    catch(error)
    {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong" });
    }
}

const signin = (req, res) => {

    const { email, password } = req.body;

    try {
        userModel.findOne({ email: email })
            .then(existingUser => {
                if (!existingUser) {
                    return Promise.reject({ status: 404, message: "User Not Found" });
                }
                return bcrypt.compare(password, existingUser.password)
                    .then(matchPassword => {
                        if (!matchPassword) {
                            return Promise.reject({ message: "Invaild Credentials" });
                        }

                        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY, { expiresIn: '2h' });

                        res.cookie("Token", token)

                        res.status(200).json({ user: existingUser, token: token })
                        console.log(existingUser, token)
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

        //res.redirect("http://localhost:4000/info")

        //res.redirect("http://localhost:4000/info")

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong" });
    }
}

const info = (req, res) => {
try {
    const userId = req.user.id;

    userModel.findById(userId)
        .then((result) => {
            if (!result) {
                return res.status(404).json({ message: "user not found" });
            }

            res.status(200).json({ message: result })
            console.log(result);
        })

        .catch((error) => {
            // console.log(error);
            res.status(500).json({ message: "Some finding error" }, error);
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong" });
    }

}

module.exports = { signup, signin, info };

//..................................................................

// .then((response) => {
//     if(response.ok)
//     {
//         return response.json();
//     }else{
//         console.log("API Error")
//     }
// })

// .then((json) => {
//     console.log(json)
//  })

// .catch((err)=>
// {
//     console.log("Error",err);
// });

//..................................................
// fetch(url,{
//     method:"GET", 
//     headers:{
//         "Authorization": "bearer " + document.cookie.split("Token=")[1]
//     }
// })
// callback();
// function resolve(response,error)
// {
//      if(response.ok)
//     {
//         return response.json()
//         .then((json) => {
//     console.log(json)
//  })

// .catch((err)=>
// {
//     console.log("Error",err);
// });
//     }else{
//         console.log("API Error")
//     }
// }



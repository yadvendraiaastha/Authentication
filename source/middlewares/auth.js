const jwt = require("jsonwebtoken");
const SECRET_KEY = "THISISUSERAPI";


const auth = (req, res, next) => {
    try {

        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];
            jwt.verify(token, SECRET_KEY, (err,decodedtoken) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {

                     res.status(400).json({ message: "Token Expired" });
                    }
                    else {
                        res.status(401).json({ message: "Unauthorized user" });
                    }
                }
                 req.user = decodedtoken;
            });

        } 

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized user" });
    }
}

module.exports = auth;


// const {email,password} = req.body;
    
// console.log(email)

//  const existingUser= userModel.findOne({email : email},function(found,notfound) 
//  {

//  if(found)
//       {
//          bcrypt.compare(password, existingUser.password,function(matched,notmached) {
//          if(matched)
//            {
//              const token = jwt.sign({email : existingUser.email, id : existingUser._id}, SECRET_KEY,{expiresIn :'2h'},function (generate,notgenerate){
//              res.cookie("Token",token)
//              res.status(200).json({user: existingUser, token:token})
//              console.log(existingUser,token)
//              });

//            }
//          else
//          {
//              return res.status(400).json({message : "Invaild Credentials" });
//          }
//      });
//  }
//  else
//  {
//      console.log("user already exist")
//  }

//  })

  

// // }catch(error)
// // {
// //  console.log(error,"something wrong");
// //  res.send("something wrong")
// //res.status(500).send("something wrong")
// }
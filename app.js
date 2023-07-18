const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const app = express();
const PORT = 5000;

const TwoMinute = 1000*2;

app.use(sessions({
    secret : "hyythisismysessionkey1234",
    saveUninitialized:true,
    cookie:{maxAge:TwoMinute},
    resave : false,
    count:0
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cookieParser());

const myusername = "rohan"
const mypassword = "hello"

//var session;

// app.get("/user",(req,res)=>
// {
//     res.send("hello")
// })
//let count=0;



app.post('/logIn',(req,res) =>
{
    if(req.body.username == myusername && req.body.password == mypassword)
    {
        //session = req.sessionStore;
        
        // session.userid = req.body.username;
        console.log(req.session.id)
        console.log(req.session.cookie)
        //console.log(session)
        //count++;
        //console.log("session count :",count)

        res.send("Hey There , Welcome <a href =\'/logout'>click to logout,</a>");
    }
    else {
        res.send("Invalid username or password");
    }
})

app.get("/logout",(req,res) =>
{
    req.session.destroy();
    res.redirect("/");
});

app.listen(PORT, ()=> 
{
    console.log(`Server Running at port ${PORT}`)
});

//..............................................................................................

const tempelatesPath = path.join(__dirname,"../templets")

// app.set("view engine","hbs")
app.set("views",tempelatesPath)

const path = require("path")
const hbs = require("hbs")

//..................................................
 // console.log(email)

 promise = new Promise(function (resolve,reject)
 {
   const existingUser = userModel.findOne({email : email})
  if(!existingUser)
  {
      resolve("already not exist please be continue...")
  }
  else
  {
      reject("Already user exist")
  }
 });
 promise.then((result) =>
 {
   return res.status(400).json(result)
 })
 promise.catch((message)=>
 {
  console.log(message)
  return res.status(400).json(message)

 })

 //.................................................
  //   .then((email)=>
    //    {
    //      bcrypt.compare(password, email.password)
    //         .then((password)=>
    //         {   
    //            res.send("all okay")
    //            console.log("all okay")
    //             // const token = jwt.sign({email : email.email, id : email._id}, SECRET_KEY,{expiresIn :'2h'});
    //         })
    //         .catch((error)=>
    //         { 
    //             res.send("invalid")
    //             // res.status(500).json(error,"user credential is not match")
    //         })
    //    })
    //    .catch((error)=>
    //    {
    //        res.send("this is error")
    //     // res.status(500).json(error,"user not found");
    //    })



    //...................................signin............................



    const signin =  async (req,res) =>{
    
        const {email,password} = req.body;
        
           console.log(email)
       try{
           
           const existingUser = await userModel.findOne({email : email})      
           if(!existingUser){
        
                return res.status(404).json({message: "User Not Found"});    
            }
    
            const matchPassword = await bcrypt.compare(password, existingUser.password);
            if(!matchPassword)
            {
                return res.status(400).json({message : "Invaild Credentials" });
            }
    
            const token = jwt.sign({email : existingUser.email, id : existingUser._id}, SECRET_KEY,{expiresIn :'2h'});
            
            res.cookie("Token",token)
    
            res.status(200).json({user: existingUser, token:token})
            //res.redirect("http://localhost:4000/info")
            console.log(existingUser,token)
             //res.redirect("http://localhost:4000/info")
    
        }catch(error)
        {
            console.log(error);
            res.status(500).json({message:"Something Went Wrong"});
        }
        
    }

    //.....................signup...............................................



    const signup = async (req,res) =>{
     
        const {username,email,password} =req.body;
        try{
          
           const existingUser = await userModel.findOne({email : email})
            if(existingUser){
                return res.status(400).json({message: "User Already Exists"});    
            }
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
           // console.log("hello")
            const result = await userModel.create({
                email: email,
                password: hashedPassword,
                username: username
            });
    
           const token = jwt.sign({email : result.email, id : result._id },SECRET_KEY);
           console.log(result,token)
            
           res.cookie("Token",token)
          
           //res.localStorage.setItem("Token", token); 
           //console.log( localStorage.setItem("Token"))
    
            res.status(201).json({user:result, token:token});
           
            //res.redirect("http://localhost:4000/info")
    
    
        } catch (error){
            console.log(error);
           // res.status(500).json({message:"Something Went Wrong"});
    
        }
     }
    
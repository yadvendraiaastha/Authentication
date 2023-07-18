const express = require("express");
const path = require("path");
const fs = require("file-system");
const hbs = require("hbs");
const app = express();
const PORT = 4000;

const userRouter = require('./routes/userRoutes'); 
const auth = require("./middlewares/auth")

const mongoose = require("mongoose");

const templatesPath = path.join(__dirname,"../templates")

app.set("view engine","hbs")
app.set("views",templatesPath)
app.use(express.urlencoded({extended:false}))

app.get("/",(req,res) =>
{
   res.render("signup")
})

 app.get("/signin",(req,res) =>
{
    res.render("signin")
})

 app.get("/info",(req,res) =>
 {
    res.render("info")
 })

 app.get("/home",(req,res) =>
 {
    res.render("home")
 })

app.use(express.json());

app.use("/users",userRouter);


const url = "mongodb+srv://yadvendrayadav2003:iaastha12@cluster2.xibdwtq.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url)
.then(() => {
    console.log("server is connected");
    app.listen(PORT, ()=>{
        console.log(`server is started on port ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
})




const express = require("express")
   require('dotenv').config();
   const multer = require('multer');
    const path = require('path');
const app = express()
const cookieParser = require("cookie-parser")
const dbConnection  = require("./config/db")
const userModel = require("./models/register-model")
 const PORT = 3000 

      const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: Only PDF and Word documents are allowed!');
  }
}).single('resume');

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

// route for the main page of the website
app.get("/", (req,res)=>{
  res.render("intern.ejs")
})

function cookieProtect(req,res, next){

  if(req.cookies.token == undefined){
    // return res.send("you are not regester: ")
   return res.redirect("/login")
  }

  // console.log(req.cookies.token)

  next()
}

app.get("/profile",cookieProtect , async(req, res)=>{

  console.log("passing protected route")

  const user = await userModel.findOne({email: req.cookies.token})
  const userName = user.fullName;
  const fund = user.fund;

  res.render("intern.ejs", {userName, fund})


})

// showing the registeration page


app.get("/register", (req, res)=>{
  res.render("register.ejs")
})

// getting the user register input data
// and sending to the database using mongoose

app.post("/register", async(req, res)=>{

  const {fullName, email, password} = (req.body)
  await userModel.create({
    fullName,
    email,
    password,
    fund: 12500

    })

  res.send("done")
})

// showing the loging page

app.get("/login", (req, res)=>{
  res.render("login.ejs")
})

//geting the user login data and authanticating from the 
  // registered data from the database 

app.post("/login", async(req, res)=>{

  const {email, password} = (req.body);

  const findUser = await userModel.findOne({
    email, 
    password
  })
  if(findUser){

    res.cookie("token", findUser.email)

    res.redirect("/")

  }else{
   return res.send("*** No user found sorry ***")
  }
 
})



app.get("/certificate", cookieProtect ,(req,res)=>{
  res.render("certificate.ejs")
})
app.get("/form", cookieProtect , (req,res)=>{
  res.render("form.ejs")
})
app.get("/submit",(req,res)=>{
  res.render("submit.ejs");
})


app.listen(PORT, ()=>console.log(`server is running on port: ${PORT}`))










const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect=require("./db/dbConnect");
const User=require("./db/userModel")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const auth = require("./auth")
dbConnect();

app.use((request,response,next)=>{
  response.setHeader("Access-Control-Allow-Origin","*");
  response.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content,Accept,Content-Type,Authorization"),

  response.setHeader("Access-Control-Allow-Methods",
  "GET,POST,PUT,DELETE,OPTIONS");
  next();
})

// body parser configuration
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register",(request,response)=>{
  bcrypt.hash(request.body.password,10)
      .then((hashedPassword)=>{
        const user=new User({
          email:request.body.email,
          password:hashedPassword,
        });

        user.save()
          .then((result)=>{
            response.status(201).send({message:"User created successfully",result});
          })
          .catch((error)=>{
            response.status(500).send({message:"User was not created",error})
          })
      })
      .catch(e=>{
        response.status(500).send("Password wasn't hashed successfully",e)
      })
});

app.post("/login",(request,response)=>{
User.findOne({email:request.body.email})
  .then((user)=>{
    bcrypt.compare(request.body.password,user.password)
      .then((passwordCheck)=>{
        if(!passwordCheck){
          return response.status(400).send({message:"Incorrect email or password"});
        }
        const token=jwt.sign({
          userId:user._id,
          userEmail:user.email},
          "RANDOM-TOKEN",
          {expiresIn:"24h"}
        );

        response.status(200).send({message:"Login successful",email:user.email,token})
      })
      .catch((error)=>{
        response.status(500).send({
        message:"Network problem",
        error
        })
        
      })
  })
  .catch((error)=>{
    response.status(404).send({
      message:"Email not found",
      error
    })
  })
});

app.get("/free-end-point",(request,response)=>{
  response.json({message:"You are free to access me anytime"});
});
app.get("/auth-end-point",auth,(request,response)=>{
  response.json({message:"You are authorized to access me"});
})



module.exports = app;

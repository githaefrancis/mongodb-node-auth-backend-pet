const mongoose=require('mongoose');
require('dotenv').config();

async function dbConnect(){

mongoose
        .connect(
            process.env.DB_URL,
            
        )

        .then(()=>{
            console.log("Successfully connected to Atlas Mongo db")
        })

        .catch(error=>{
            console.log("unable to connect to mongo db");
            console.error(error);
        })
}

module.exports=dbConnect;




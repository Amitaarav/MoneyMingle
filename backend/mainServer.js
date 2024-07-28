const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = 3000;
const userRouter = require("./routes/user");
const accountRouter = require("./routes/account");
const jwt_secret = require("./config");
const app = express(); //two arguments then app is slightly better
app.use(cors());
// app.use(bodyparser.json());//express json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
//if express version is 4.16.0 or higher, you don't need to use body-parser anymore.
//use
app.use(express.json());

app.use("/api/v1",userRouter);
app.use("/api/v2",accountRouter);

// /api/v1/user/signup
// /api/v1/user/signin
// /api/v1/user/changepassword
// /api/v1/account/transfermoney
// /api/v1/account/balance


app.listen(port,function(err){
    if(err){
        console.log(err);
    }
    console.log("server running on port "+ port);
})

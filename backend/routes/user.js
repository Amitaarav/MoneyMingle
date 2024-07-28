const express = require("express");

const zod = require("zod");
const router = express.Router();
const {User} = require("../config")
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
    
})
//router for signup
router.post("/signup",async (req,res)=>{
    //make sure schema is valid
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message:"Email aiready taken / incorrect input"
        })
    }
    //check if user already exists
    const user = await User.findOne({
    username: body.username,
    })

    //if existing user exist stop the signup request
    if(user._id){
    return res.json({
        message:"Email aiready taken / incorrect input"
    })  
    }
    //create a new user
    const dbUser = await User.create({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password:req.body.password
    });
    //create the token
    const token = jwt.sign({
        id:dbUser._id
    },JWT_SECRET);

    //return the response
    res.json({
        message:"User created successfully",
        token:token,
        user:dbUser
    })
    // create new account
    const userId = user._id;
    await Account.create({
        userId,
        balance:1 + Math.random() * 1000
    })

})

//router for signin a user
const signingUser = zod.object({
    username:zod.string().email(),
    password:zod.string()
})

router.post("/signin",async(req,res)=>{
    const {success} = signingUser.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Email aiready taken / incorrect input"
        })
    }

    const user = await User.findOne({
        username:req.body.username,
        password:req.body.password
    })

    if(user){
        const token = jwt.sign({
            id:user._id
        },JWT_SECRET);
        res.json({
            message:"User signed in successfully",
            token:token,
        })
        return ;
    }

    res.status(411).json({
        message:"Error while logging in"})
})

//router to update the user

const updateUser = zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(), 
    lastName:zod.string().optional()
})

router.put("/update",async(req,res)=>{
    const {success} = updateUser.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Error while updating user"
        })
    }

    await User.updateOne(req.body,{
        id:req.userId
    })

    res.status(200).json({
        message:"User updated successfully"
    })
})

router.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or:[
            {
                firstName:{$regex:filter}},{
                    lastName:{$regex:filter}
                }
        ]
    })

    res.json({
        user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})

module.exports = router;
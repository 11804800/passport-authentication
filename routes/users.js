var express = require("express");
const userSchema = require("../model/userSchema");
var router = express.Router();
var passport = require("passport");
var authenticate = require("../utils/authentication");

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const result = await userSchema.find({});
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json(error);
  }
});


//for signup 
router.post("/signup", (req, res) => {
  //registering the new user 
  //if no error the it save the user and 
  //passport strategy willbe used.
  userSchema.register( new userSchema(
    {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
    }),
      req.body.password,(err,user)=>{
        if(err)
        {
          res.status(401).json({err:err.message})
        }
        else
        {
          user.save().then((user)=>{
            passport.authenticate("local")(req,res,()=>{
              res.status(200).json({message:"user created"})
            })
          })
          .catch((err) => {
            res.status(500).json({ success: false, message: err });
          });
        }
      }
    )
});


//for login

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',(err,user,info)=>{
    if (err) {
      res.status(500).json({ success: false, err: err });
    }
    else if(!user)
    {
      //if user not found it will show this message
      res.status(401).json({success:false,err:info.name,message:info.message});
    }
    else
    {
      req.logIn(user,(err)=>{

          var token = authenticate.getToken({ _id: user._id });
          res.status(200).json({ success: true,message:"Login Successfull", token: token });
      })
    }
  })(req, res, next);
});


//for changing the password
router.post('/changepassword',(req,res)=>{
  userSchema.findByUsername(req.body.username,(err,user)=>{
    if(err)
    {
      res.status(500).json({success:false,message:err})
    }
    else
    {
      if(!user)
      {
        res.status(401).json({success:false,message:"User not found"});
      }
      else
      {
       user.changePassword(req.body.oldPassword,req.body.newPassword,(err)=>{
        if(err)
        {
          res.status(401).json({success:true,message:"password failed to Chnage"});
        }
        else
        {
          res.status(200).json({success:true,message:"password Changed"});
        }
       })
      }
    }
  })
});


//for password reset
router.post('/resetpassword', (req,res)=>{
  userSchema.findByUsername(req.body.username,(err,user)=>{
    if(err)
    {
      res.status(500).json({success:false,message:err})
    }
    else
    {
      if(!user)
      {
        res.status(401).json({success:false,message:"User not found"});
      }
      else
      {
       user.setPassword(req.body.password,async (err,user)=>{
        if(err)
        {
          res.status(401).json({success:true,message:"password failed to Chnage"});
        }
        else
        {
          await user.save();
          res.status(200).json({success:true,message:"password Changed"});
        }
       })
      }
    }
  })
});

module.exports = router;

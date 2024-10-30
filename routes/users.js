var express = require("express");
const userSchema = require("../model/userSchema");
var router = express.Router();
var passport = require("passport");
var authenticate = require("../utils/authentication");

/* GET users listing. */
router.get("/", function (req, res, next) {
  userSchema
    .find({})
    .then(
      (result) => {
        res.status(200).json(result);
      },
      (err) => res.status(500).json({ err: err })
    )
    .catch((err) => {
      res.status(500).json({ err: err });
    });
});

router.post("/signup", (req, res) => {
  userSchema.register(
    new userSchema(
      {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
      },
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
  );
});

module.exports = router;

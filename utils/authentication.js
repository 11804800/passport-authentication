const jwt=require('jsonwebtoken');
var passport=require('passport');
//extracting some inbuilt passport js strategy
//for extracting jwt
const ExtractJwt = require('passport-jwt').ExtractJwt;
//for defining the strategy
const JwtStrategy = require('passport-jwt').Strategy;
//for passport local strategy
const LocalStrategy = require('passport-local').Strategy;

const userSchema=require('../model/userSchema');

//exporting the local for authenicating
exports.local=passport.use(new LocalStrategy(userSchema.authenticate()));

//serializing and deserializing the user
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

//creating the gettoken method to generate the jwt token
exports.getToken=function(user)
{
    //it takes and user, secret key then expires time
    return jwt.sign(user,"12345-67889-122344-1222",{expiresIn:"1m"})
}

//creating empty object;
var opts={};
//extracting the jwt from the header as bearer token from request header
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey="12345-67889-122344-1222"


//it takes opts object and then a callback function with jwt payload and done
exports.jwtpassport=passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
    userSchema.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err){
            return done(err, false);
        }
        else if (user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    })
}));

//exporting the function to verify the user before the user get access
exports.verifyuser=passport.authenticate('local',{session:false});
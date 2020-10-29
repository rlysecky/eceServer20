const express = require('express');
let router = express.Router();
let bcrypt = require("bcryptjs");
let jwt = require("jwt-simple");
let fs = require('fs');
let User = require('../models/users');
let Device = require('../models/device');

// On Repl.it, add JWT_SECRET to the .env file, and use this code
// let secret = process.env.JWT_SECRET

// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
let secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();

// Register a new user
router.post('/register', function(req, res) {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
      res.status(400).json({success : false, message : err.errmsg});  
    }
    else {
      let newUser = new User({
        email: req.body.email,
        fullName: req.body.fullName,
        passwordHash: hash
      });

      newUser.save(function(err, user) {
        if (err) {
          res.status(400).json({success: false,
                                message: err.errmsg});
        }
        else {
          res.status(201).json({success: true,
                                message: user.fullName + " has been created."});
        }
      });
    }
  });    
});

// Authenticate a user
router.post('/signin', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      res.status(401).json({ success: false, message: "Can't connect to DB." });
    }
    else if (!user) {
      res.status(401).json({ success: false, message: "Email or password invalid." });
    }
    else {
      bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
        if (err) {
          res.status(401).json({ success: false, message: "Error authenticating. Contact support." });
        }
        else if(valid) {
          let authToken = jwt.encode({email: req.body.email}, secret);
          res.status(201).json({ success: true, authToken: authToken });
        }
        else {
          res.status(401).json({ success: false, message: "Email or password invalid." });
        }
      });
    }
  });
});

// Return account information
router.get('/account', function(req, res) {
  if (!req.headers["x-auth"]) {
    res.status(401).json({ success: false, message: "No authentication token."});
    return;
  }

  let authToken = req.headers["x-auth"];
  let accountInfo = { };

  try {
     // Toaken decoded
     let decodedToken = jwt.decode(authToken, secret);

     User.findOne({email: decodedToken.email}, function(err, user) {
       if (err) {
         res.status(400).json({ success: false, message: "Error contacting DB. Please contact support."});
       }
       else {
         accountInfo["success"] = true;
         accountInfo["email"] = user.email;
         accountInfo["fullName"] = user.fullName;
         accountInfo["lastAccess"] = user.lastAccess;
         
         // Find devices based on decoded token
         Device.find({ userEmail : decodedToken.email}, function(err, devices) {
           // Construct device list
           let deviceList = []; 

           if (!err) {
             for (device of devices) {
               deviceList.push({ deviceId: device.deviceId, apikey: device.apikey });
             }
           }

           accountInfo['devices'] = deviceList;
           res.status(200).json(accountInfo);
         });
       }
     });
  }
  catch (ex) {
    // Token was invalid
    res.status(401).json({ success: false, message: "Invalid authentication token."});
  }
});

module.exports = router;

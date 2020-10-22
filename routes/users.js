const express = require('express');
let router = express.Router();
let bcrypt = require("bcryptjs");
let User = require('../models/users');

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

module.exports = router;

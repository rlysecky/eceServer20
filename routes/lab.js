let express = require('express');
let router = express.Router();
let Device = require("../models/device");
let LabData = require("../models/labdata");

// Function to generate a random apikey consisting of 32 characters
function getNewApikey() {
  let newApikey = "";
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  for (let i = 0; i < 32; i++) {
    newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return newApikey;
}

// GET request return one or "all" devices registered and last time of contact.
router.get('/status/:devid', function(req, res, next) {
  let deviceId = req.params.devid;
  let responseJson = { devices: [] };
  let query = {};
  
  if (deviceId != "all") {
    query = {
      "deviceId" : deviceId
    };
  }
  
  Device.find(query, function(err, allDevices) {
    if (err) {
      let errorMsg = {"message" : err};
      res.status(400).json(errorMsg);
    }
    else {
      for (let doc of allDevices) {
        responseJson.devices.push({ "deviceId": doc.deviceId,  "apiKey": doc.apikey, "lastContact" : doc.lastContact});
      }
    }
    res.status(200).json(responseJson);
  });
});

router.post('/register', function(req, res, next) {
  let responseJson = {
    registered: false,
    message : "",
    apikey : "none",
    deviceId : "none"
  };
  let deviceExists = false;
  
  // Ensure the request includes the deviceId parameter
  if( !req.body.hasOwnProperty("deviceId")) {
    responseJson.message = "Missing deviceId.";
    return res.status(400).json(responseJson);
  }

  // Ensure the request includes the email parameter
  if( !req.body.hasOwnProperty("email")) {
     responseJson.message = "Invalid authorization token or missing email address.";
     return res.status(400).json(responseJson);
  }
    
  // See if device is already registered
  Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
    if (device !== null) {
      responseJson.message = "Device ID " + req.body.deviceId + " already registered.";
      return res.status(400).json(responseJson);
    }
    else {
      // Get a new apikey
	   deviceApikey = getNewApikey();
	    
	    // Create a new device with specified id, user email, and randomly generated apikey.
      let newDevice = new Device({
        deviceId: req.body.deviceId,
        userEmail: req.body.email,
        apikey: deviceApikey
      });

      // Save device. If successful, return success. If not, return error message.
      newDevice.save(function(err, newDevice) {
        if (err) {
          responseJson.message = err;
          // This following is equivalent to: res.status(400).send(JSON.stringify(responseJson));
          return res.status(400).json(responseJson);
        }
        else {
          responseJson.registered = true;
          responseJson.apikey = deviceApikey;
          responseJson.deviceId = req.body.deviceId;
          responseJson.message = "Device ID " + req.body.deviceId + " was registered.";
          return res.status(201).json(responseJson);
        }
      });
    }
  });
});

/* POST: Add data. */
router.post('/report', function(req, res, next) {
  var responseJson = { 
    status : "",
    message : ""
  };

  // Ensure the POST data include properties id and email
  if( !req.body.hasOwnProperty("deviceId") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing deviceId parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }

  if( !req.body.hasOwnProperty("apikey") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing apikey parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }
  
  if( !req.body.hasOwnProperty("avgBPM") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing avgBPM parameter.";
    return res.status(201).send(JSON.stringify(responseJson));
  }
  
  // Find the device and verify the apikey
  Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
    if (device !== null) {
      if (device.apikey != req.body.apikey) {
        responseJson.status = "ERROR";
        responseJson.message = "Invalid apikey for device ID " + req.body.deviceId + ".";
        return res.status(201).send(JSON.stringify(responseJson));
      }
      else {
        // Create a new hw data with user email time stamp 
        var newLabData = new LabData({
          userEmail: device.userEmail,
          deviceid: req.body.deviceId,
          avgBPM: req.body.avgBPM,
        });

        // Save device. If successful, return success. If not, return error message.                          
        newLabData.save(function(err, newLabData) {
          if (err) {
            responseJson.status = "ERROR";
            responseJson.message = "Error saving data in db.";
            return res.status(201).send(JSON.stringify(responseJson));
          }
          else {
            responseJson.status = "OK";
            responseJson.message = "Data saved in db with object ID " + newLabData._id + ".";
            return res.status(201).send(JSON.stringify(responseJson));
          }
        });
      }
    } 
    else {
      responseJson.status = "ERROR";
      responseJson.message = "Device ID " + req.body.deviceId + " not registered.";
      return res.status(201).send(JSON.stringify(responseJson));    
    }
  });
});

module.exports = router;

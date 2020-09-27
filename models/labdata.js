var db = require("../db");

// Define the schema
var labDataSchema = new db.Schema({
    deviceId:   String,
    userEmail:  String,
    avgBPM:     Number,
    submitTime: { type: Date, default: Date.now }
});

// Creates a Devices (plural) collection in the db using the device schema
var LabData = db.model("LabData", labDataSchema);

module.exports = LabData;


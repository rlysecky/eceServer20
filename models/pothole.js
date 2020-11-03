let db = require("../db");

let potholeSchema = new db.Schema({
    loc:           { type: [Number], index: '2dsphere'},
    totalHits:     Number,
    zip:           String,
    lastReported:  { type: Date, default: Date.now },
    firstReported: { type: Date, default: Date.now }
});

let Pothole = db.model("Pothole", potholeSchema);

module.exports = Pothole;

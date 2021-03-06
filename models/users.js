let db = require("../db");

let userSchema = new db.Schema({
  email:        { type: String, required: true, unique: true },
  fullName:     { type: String, required: true },
  passwordHash: String,
  lastAccess:   { type: Date, default: Date.now },
  userDevices:  [ String ],
  potholesHit:  [ { potholeId: Number, numHits: Number } ]
});

let User = db.model("User", userSchema);

module.exports = User;

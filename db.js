var mongoose = require("mongoose");

mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost/db20", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

module.exports = mongoose;

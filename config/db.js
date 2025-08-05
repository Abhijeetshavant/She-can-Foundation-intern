const mongoose = require("mongoose")

const dbConnection = mongoose.connect("mongodb://0.0.0.0/InternPortal")
.then(()=>console.log("Database connected successfully"));

module.exports = dbConnection;

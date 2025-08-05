const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  fund:Number
  

})

module.exports = mongoose.model("intern", userSchema)



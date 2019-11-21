var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  user: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Username are required."],
    unique: [true, "User must be unique."]
  },
  mail: {
    type: String,
    required: [true, "E-mail are required."],
    unique: [true, "E-mail already registered."]
  },
  pass: {
    type: String,
    required: [true, "Password are required."],
    min: [6, "Password must be at least 6 characters."],
    max: 12
  },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("User", UserSchema);

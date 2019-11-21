var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  message: {
    type: String
  },
  video: {
    type: String
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Message", MessageSchema);

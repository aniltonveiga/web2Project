var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  user: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Digite um nome de usuário"],
    unique: [true, "Já existe um usuário com esse nome"]
  },
  email: {
    type: String,
    required: [true, "Digite um endereço de email"],
    unique: [true, "Já existe um usuário com esse email"]
  },
  password: {
    type: String,
    required: [true, "Cadastre uma senha"],
    min: [4, "Digite pelo menos 4 caracteres"],
    max: 12
  },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("User", UserSchema);

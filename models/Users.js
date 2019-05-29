const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  googleId: String,
  githubId: String,
  image: String,
  name: String
});

mongoose.model("users", usersSchema);

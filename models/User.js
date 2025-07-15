import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const User = mongoose.model("UserDB", userSchema);
export default User;

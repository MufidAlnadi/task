const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    activated: {
      type: Boolean,
      default: false,
      required: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId, 
        ref: "Subject", 
      }
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

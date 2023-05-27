const mongoose = require("mongoose");
const validation = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An User must have a name."],
    },
    email: {
      type: String,
      required: [true, "An User must have an email."],
      unique: true,
      validate: {
        validator: function (v) {
          return validation.isEmail(v);
        },
        message: ({ value }) => `${value} is not a valid Email!`,
      },
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    photo: String,
    phone_number: String,
    password: {
      type: String,
      required: [true, "Please Provide a password to authenticate yourself!"],
      select: false,
    },
    confirm_password: {
      type: String,
      required: [
        true,
        "Please confirm your password to authenticate yourself!",
      ],
      validate: {
        validator: function (v) {
          return this.password === v;
        },
        message: "Password did not match.",
      },
    },
    password_changed_at: Date,
    active: {
      type: Boolean,
      enum: [true, false],
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// pre-document middlewares

// password hash
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirm_password = undefined;
  next();
});

//schema methods

userSchema.methods.comparePassword = (hasedPassword, curPass) => {
  return bcrypt.compare(curPass, hasedPassword);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

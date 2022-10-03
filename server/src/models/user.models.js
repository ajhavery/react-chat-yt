/*************************************************************************
 * User Model is a replica of the mysql user model that is
 * stored in identity service
 * Everytime a user is created or updated or deleted, identity
 * will emit an event which will be used to update the mongoDb user model
 **************************************************************************
 */

/*************************************************************************
 * Final model to be used in our app will have only 4 fields:
 * 1. mysqlid
 * 2. name
 * 3. avatar
 * 4. roles
 * Email and password fields here are dummy fields used to replicate an independent app
 **************************************************************************
 */

const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    mysqlid: { type: Number, required: true, default: 0 },
    name: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    roles: [{ type: String, required: true, default: "USER" }],
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;

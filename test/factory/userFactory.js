const mongoose = require("mongoose");
const User = require("../../models/User");
const githubUserID = new mongoose.Types.ObjectId();
const githubUser = {
  _id: githubUserID,
  displayName: "githubuser",
  githubId: "github Id",
};

const setupDatabaseOAuth = async () => {
  await User.deleteMany();
  await new User(githubUser).save();
};

module.exports = {githubUserID, githubUser, setupDatabaseOAuth };
  
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const githubUserID = new mongoose.Types.ObjectId();

const githubUser = {
  _id: githubUserID,
  userName: "githubuser",
  githubId: "github Id",
};

const setupDatabaseOAuth = async () => {
  await User.deleteMany();
  await Skill.deleteMany();
  await new User(githubUser).save();
};

module.exports = async () => {
  githubUserID, githubUser, setupDatabaseOAuth;
};

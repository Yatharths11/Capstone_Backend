const { login, logout } = require("./authControllers");
const {
  register,
  profile,
  updateProfile,
  deleteUser
} = require("./usersControllers");
const { all, story, create, add, getbyusername } = require("./storyContollers");
module.exports = {
  register,
  login,
  profile,
  updateProfile,
  deleteUser,
  all,
  getbyusername,
  story,
  create,
  add,
  logout
};

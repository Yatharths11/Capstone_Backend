const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/User")
/**
 * Function that returns a hashed password that
 * can be stored in the database
 * @param {String} password 
 * @returns hashpassword for input password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt()
  return await bcrypt.hash(password, salt)
}


/**
 * Function that checks if entered passoword is correct
 * @param {String} user that is trying to login
 * @param {String} password password entered by the user
 * @returns a boolean value indicating whether the 
 * plaintext value matches the hashed value.
 */
async function verifyPassword(user, password) {
  return await bcrypt.compare(password, user.password)
}


/**
 * Function that decodes token and extracts payload 
 * from the token
 * @param {string} token 
 * @returns decoded - the decoded payload from token
 */
function decodeToken(token) {
  const accessToken = token.split(' ')[1]
  // console.log("backend token:", tokenPayload)
  // Verify and decode the token
  const decoded = jwt.verify(accessToken, process.env.SECRET_KEY)
    console.log("Decoded Token:", decoded)
  return decoded
}

async function userIdToUsername(id) {

  const query = await User.findById(id)
    .select('username')
    .exec();

  return query
}

async function usernameToUserId(username) {
  const query = await User.findOne({ username: username })
    .select('_id')
    .exec()

  return query;
}


module.exports = { hashPassword, verifyPassword, decodeToken, userIdToUsername, usernameToUserId }
// internal imports
const Users = require("../models/User")
const jwt = require("jsonwebtoken")
const { verifyPassword } = require("../utility/utility")

/**
 * function to perform login operation
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body
    // Check if the password is correct
    const user = await Users.findOne({ username: username })

    if (!user) {
      throw new Error(
        "Username doesn't exist. Please enter the right username."
      )
    }
    const checkPassword = await verifyPassword(user, password)

    if (!checkPassword) {
      return res.status(401).json({ error: "Incorrect password." })
    }
    
    // User is authenticated, create JWT token
    const accessToken = jwt.sign(
      
      { username: user.username, id: user.id },
      process.env.SECRET_KEY,
      { expiresIn: "48h" }
    )

    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY)
    console.log("Decoded Token:", decoded)
    res.set("Authorization", "Bearer " + accessToken)
    res
      .status(200)
      .json({ token: accessToken, message: "User logged in successfully." })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to login. Try again." })
  }
}

const logout = (req, res) => {
  try {
    const token = req.headers.authorization // Extract the JWT token from the request headers    
    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: "Failed to logout" })
  }
  
}

// exports
module.exports = { login, logout }
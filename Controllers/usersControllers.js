
const Users = require("../models/User")
const { hashPassword, decodeToken } = require("../utility/utility")
const { check_valid_username, check_valid_password, check_valid_email } = require("../validators/user_validators")
const Group = require("../models/Group")


// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const usernameExist = await Users.findOne({ username: username })
    if (usernameExist) {
      return res.status(401).json({
        error: "Username already exists. Please try another Username.",
      })
    }
    // Check if username, email, and password are valid
    if (!check_valid_username(username)) {
      return res.status(400).json({
        error:
          "Invalid username. Username must contain only letters, numbers, underscores, and hyphens, and be between 3 to 20 characters long.",
      })
    }
    const emailExist = await Users.findOne({ email: email })
    if (emailExist) {
      return res
        .status(401)
        .json({ error: "Email already exists. Please try another email." })
    }
    if (!check_valid_email(email)) {
      return res.status(400).json({ error: "Invalid email address." })
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required." })
    }
    if (!check_valid_password(password)) {
      return res.status(400).json({
        error: "Invalid password. Password must be at least 6 characters long.",
      })
    }
    // Hash the password
    const hashedPassword = await hashPassword(password)
    // Create a new user
    const newUser = await Users.create({
      username: username,
      email: email,
      password: hashedPassword,
    })

    res
      .status(201)
      .json({ message: "New user registered successfully.", user: newUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to register new user." })
  }
}

/**
 * Get the user data 
 * @param {*} req 
 * @param {*} res 
 *@returns 102. 402
 */
const profile = async (req, res) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' })
  }

  const decodedToken = decodeToken(token)

  if (!decodedToken || !decodedToken.username) {
    return res.status(401).json({ message: 'Invalid authorization token' })
  }

  try {
    const user = await Users.findOne({ username: decodedToken.username })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ user })
  } catch (error) {
    console.error('Error finding user:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

/**
* API to update user profile
* @param {*} req      - Express request object
* @param {*} res      - Express response object
* @returns {Object}   - Response indicating success or failure of profile update
*/
const updateProfile = async (req, res) => {
  const token = req.headers.authorization;

  // Check if authorization token is present
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  const decodedToken = decodeToken(token);

  // Verify the validity of the authorization token
  if (!decodedToken || !decodedToken.username) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }

  try {
    const updatedProfile = req.body; // Extract updated profile data from request body

    // Update user profile
    const user = await Users.findOneAndUpdate(
      { username: decodedToken.username },
      updatedProfile,
      { new: true } // Return the updated document
    );

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return success response with updated user profile
    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


/**
 * API to delete a user.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns {Object} - Response indicating success or failure.
 */
const deleteUser = async (req, res) => {
  const token = req.headers.authorization;

  // Check if authorization token is missing
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  // Decode the authorization token to get the username
  const decodedToken = decodeToken(token);

  // Check if the authorization token is invalid or username is missing
  if (!decodedToken || !decodedToken.username) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }

  try {
    // Find and delete the user from the database based on the decoded username
    const user = await Users.findOneAndDelete({ username: decodedToken.username });

    // Check if the user is found and deleted successfully
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return success message if user is deleted successfully
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    // Return internal server error if any error occurs during the process
    return res.status(500).json({ message: 'Internal server error' });
  }
}


const getmygroup = async (req, res) => {

  const token = req.headers.authorization

  //verify token is present or not
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' })
  }

  //verify whether the user name is in the database or not 
  const decodedToken = decodeToken(token)

  if (!decodedToken || !decodedToken.username) {
    return res.status(401).json({ message: 'Invalid authorization token' })
  }

  const user_id = decodedToken.id
  console.log(user_id)
  try {
    // Find all groups where the given user is in the collaborators array
    const groups = await Group.find({ collaborators: user_id }).populate('storyId');

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error finding groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const mycreatedstory = async (req, res) => {

  const token = req.headers.authorization

  //verify token is present or not
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' })
  }

  //verify whether the user name is in the database or not 
  const decodedToken = decodeToken(token)

  if (!decodedToken || !decodedToken.username) {
    return res.status(401).json({ message: 'Invalid authorization token' })
  }

  const user_id = decodedToken.id
  const my_created_stories = []
  let query = await Group.find({ creatorId: user_id })
    .then((result) => {
      console.log(result)
    })

}


module.exports = { register, profile, updateProfile, deleteUser, getmygroup, mycreatedstory }

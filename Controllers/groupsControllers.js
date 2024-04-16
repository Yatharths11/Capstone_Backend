const User = require("../models/User")
const { hashPassword, decodeToken, userIdToUsername, usernameToUserId } = require("../utility/utility")
const Group = require("../models/Group")
const jwt = require('jsonwebtoken')
const create = async (req, res) => {
    try {

        //verify whetheer token is present or not
        const token = req.headers.authorization
        const accesstoken = token.split(" ")[1]
        // console.log(token)
        if (!token) {
            return res.status(401).send({ auth: false, message: 'No Token Provided.' })
        }

        // Decode the token and verify if it's valid
        const decodedtoken = jwt.verify(accesstoken, process.env.SECRET_KEY)

        // console.log("decodeed token from group controller", usernameToUserId(decodedtoken.username))
        if (!decodedtoken || !decodedtoken.username) {
            return res.status(401).json({ message: 'Invalid authorization token.' })
        }

        // Check if the user exists in the database
        const userExists = await User.findOne({ username: decodedtoken.username })
        if (!userExists) {
            return res.status(402).send("Username does not exist.")
        }

        // Validate and process the list of usernames
        const list_of_usernames = req.body.list
        const validUserIds = [decodedtoken.id]

        for (const username of list_of_usernames) {
            const userId = await usernameToUserId(username)

            if (!userId) {
                return res.status(400).send("Invalid username provided.")
            }

            validUserIds.push(userId)
            // console.log(validUserIds)
        }

        // Create the group object
        const group = {
            creatorId: userExists._id,
            storyId: req.body.storyId,
            collaborators: validUserIds
        }
        console.log(group)
        // Create the group in the database
        const createdGroup = await Group.create(group)
        console.log(`Created new group with id ${createdGroup._id}`)
        res.status(200).json(createdGroup)
    } catch (err) {
        console.error('Error creating new group', req.body, err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = { create }

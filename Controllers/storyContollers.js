const Story = require("../models/Story")
const Prompt = require("../models/Prompt")
const mongoose = require('mongoose')
const date_streak = require('date-streaks')
const { decodeToken } = require("../utility/utility")
const User = require("../models/User")
const Group = require("../models/Group")

/**
 * API that gets all the stories from the database
 * @param {*} req 
 * @param {*} res 
 * @returns all stories from database
 */
const allpublic = async (req, res) => {
    try {
        const stories = await Story.find({isPrivate:false}).populate('contributors')
        res.status(200).json({ status: 'success', data: { stories } })
    } catch (err) {
        console.error('Error fetching stories:', err)
        res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
}

const allprivate = async (req, res) => {
    const token = req.headers.authorization
    //token is present or not
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing.' })
    }

    //username in token is in db or not
    const decodedToken = decodeToken(token)
    if (!decodedToken || !decodedToken.username) {
        return res.status(401).json({ message: 'Invalid authorization token.' })
    }
    try {
        console.log((decodedToken.id))
        // const stories = await Story.find({isPrivate:true}).populate('contributors')
        // res.status(200).json({ status: 'success', data: { stories } })
        const groups = await Group.find({ collaborators: decodedToken.id });
        res.status(200).json({ status: 'success', data: { groups } })
    } catch (err) {
        console.error('Error fetching stories:', err)
        res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
}


/**
 * API to get in the database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const story = async (req, res) => {
    try {
        // Check if the ID parameter is provided
        const storyId = req.query.id
        console.log(storyId)
        if (!storyId) {
            return res.status(400).json({ message: "Story ID is required" })
        }

        // Find the story by ID
        const story = await Story.findById(storyId).populate('contributors')

        // Check if the story exists    
        if (!story) {
            return res.status(404).json({ message: "Story not found" })
        }

        // Respond with the story
        res.status(200).json({ status: 'success', data: { story } })
    } catch (err) {
        // Handle errors
        console.error('Error fetching story:', err)
        res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
}


/**
 * Api to create new story. It also creates prompt at the same time
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const create = async (req, res) => {

    try {
        const token = req.headers.authorization
        console.log(token)
        //token is present or not
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing.' })
        }

        //username in token is in db or not
        const decodedToken = decodeToken(token)
        if (!decodedToken || !decodedToken.username) {
            return res.status(401).json({ message: 'Invalid authorization token.' })
        }


        const userExists = await User.find({ username: decodedToken.username })

        //title of the story is required
        const title = req.body.title
        if (!title) {
            return res.status(400).json({ message: 'Title cannot be empty.' })
        }

        //description of the story is also mandatory
        const description = req.body.description
        if (!description) {
            return res.status(400).json({ message: 'Description cannot be empty.' })
        }

        //takein current date
        const currentDate = new Date()

        // Pormpt Creation
        const prompt = {
            title: req.body.title,
            description: req.body.description,
            creator: decodeToken.username,
            date: currentDate.getDate()
        }

        //creating new prompt as document in the database
        const promptdb = await Prompt.create(prompt)

        const fetched_prompt = await Prompt.find({ title: prompt.title })
        console.log('Prompt created successfully:', fetched_prompt[0])

        //story creation
        const story = {
            prompt: fetched_prompt[0].id,
            title: req.body.title,
            createdAt: currentDate,
            isPrivate: req.body.isPrivate,
            contributors: req.body.contributors ? [userExists.id, req.body.contributors] : [userExists.id],
            content: [
                { "text": req.body.story, date: currentDate }
            ]
        }

        //retriving the created story to send as a response
        const createdStory = await Story.create(story)
        console.log(createdStory);
        // sending story as a response
        res.status(201).json({ status: 'created', story: createdStory })


    } catch (err) {
        console.error('Error creating story:', err)
        res.status(500).json({ message: 'Internal server error.' })
    }
}

/**
 * API that adds text to a already created story
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const add = async (req, res) => {
    try {
        const storyId = req.query.id

        //Authentication
        const token = req.header('Authorization')
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing.' })
        }

        //Authorization
        const decodedToken = decodeToken(token)
        if (!decodedToken || !decodedToken.username) {
            return res.status(401).json({ message: 'Invalid authorization token.' })
        }

        //Checking if the story exists or not 
        const story = await Story.findById(storyId)
        // console.log(story)
        if (!story) {
            return res.status(404).json({ message: 'Story not found.' })
        }

        // Get current date in ISO format
        const currentDate = new Date()
        //If the story is public then allow anyone to add to it
        //if it is private, then check is the current user is one of the constributor or not
        let alreadyContributed = false;

        // Checking if the user has already contributed today
        if (story.isPrivate === true && story.contributors.includes(decodedToken.id)) {
            const contents = story.content;
            contents.forEach((content) => {
                if (content.contributor === decodedToken._id &&
                    content.date.getDate() === currentDate.getDate()) {
                    alreadyContributed = true;
                }
            });
        }

        // If the user has already contributed today, send the appropriate response
        if (alreadyContributed) {
            return res.status(300).json({ message: `You have already contributed today. Please contribute tomorrow.` });
        }

        // Collecting the contents to be added from the body
        const newContent = {
            text: req.body.text,
            contributor: decodedToken.id,
            date: currentDate,
            upvotes: 0,
            downvotes: 0
        };

        story.content.push(newContent);
        story.markModified('content');

        const savedStory = await story.save();
        const addedContent = savedStory.content[savedStory.content.length - 1];

        // Sending the success response after adding content
        res.status(201).json({ message: 'Content added successfully.', content: addedContent });
    } catch (err) {
        console.error('Error adding content:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// const add = async (req, res) => {
//     try {
//         story_id = req.query.id

//         // Authentication
//         const token = req.header('Authorization')
//         if (!token) {
//             return res.status(401).json({ message: 'Authorization token is missing.' })
//         }

//         // Authorization
//         const decodedToken = decodeToken(token)
//         if (!decodedToken || !decodedToken.username) {
//             return res.status(401).json({ message: 'Invalid authorization token.' })
//         }

//         // Checking if the story exists or not 
//         const story = await Story.findById(story_id)
//         if (!story) {
//             return res.status(404).json({ message: 'Story not found.' })
//         }

//         // Getting current date
//         const currentDate = new Date()

//         // Checking for private story
//         if (story.isPrivate === true) {
//             if (!story.contributors.includes(decodedToken.id)) {
//                 return res.status(401).send("You are not authorized to contribute to this private story")
//             }


//         }

//         // Checking if the contributor has already contributed today
//         const alreadyContributedToday = story.content.some(content => {
//             // console.log(content.date.getDate(), currentDate.getDate())
//             return content.date.getDate() !== currentDate.getDate()
//         })
//         console.log(alreadyContributedToday)
//         if (alreadyContributedToday) {
//             console.log(decodedToken.id,)
//             return res.status(401).send("You have already contributed today. Please contribute tomorrow")
//         }

//         // When story is public or has passed through privacy filters
//         const newContent = {
//             text: req.body.text,
//             contributor: decodedToken.id,
//             date: currentDate,
//             upvotes: 0,
//             downvotes: 0
//         }

//         story.content.push(newContent);
//         story.markModified('content');

//         const savedStory = await story.save()
//         const addedContent = savedStory.content[savedStory.content.length - 1]

//         // Sending the success response after adding content
//         return res.status(201).json({ message: 'Content added successfully.', content: addedContent });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal server error.' });
//     }
// }


const getbyusername = async (req, res) => {
    //Authentication
    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing.' })
    }

    //Authorization
    const decodedToken = decodeToken(token)
    if (!decodedToken || !decodedToken.username) {
        return res.status(401).json({ message: 'Invalid authorization token.' })
    }
    const user_id = decodedToken.id
    console.log(user_id)

    const userStories = await Story.aggregate([
        {
            '$match': {
                'content.contributor': new mongoose.Types.ObjectId(user_id)
            }
        }
    ])
        .catch(error => {
            console.error(error);
        });
    storiesarray = []
    contribution_dates = []
    userStories.forEach((story) => {

        if (!storiesarray.includes(story._id)) {
            storiesarray.push(story)
            story.content.forEach((content) => {
                if (content.date !== undefined) {
                    // console.log("date",content.date.getDate())
                    contribution_dates.push(content.date.getDate())
                }

            })
        }
    })

    console.log(userStories.length)
    const streak_summary = date_streak.summary([contribution_dates])
    console.log(streak_summary) 
    data = {
        stories: userStories,
        currentStreak: streak_summary.currentStreak,
        longestStreak: streak_summary.longestStreak
    }
    res.status(200).send(data)
}

module.exports = { allpublic, story, create, add, getbyusername, allprivate }
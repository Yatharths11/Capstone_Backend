
const togglelike = async (req, res) => {
    const storyId = req.query.id;

    // Authentication
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing.' });
    }

    // Authorization
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.username) {
        return res.status(401).json({ message: 'Invalid authorization token.' });
    }

    try {
        // Find the story by ID
        const story = await Story.findByIdAndUpdate(storyId, {}, { new: true });

        // Check if story exists
        if (!story) {
            throw new Error(`No story with the id ${storyId}`);
        }

        // Update likes based on user interaction
        if (story.likes.includes(decodedToken.id)) {
            // User already liked the story, remove like
            await Story.findByIdAndUpdate(storyId, { $pull: { likes: decodedToken.id } });
        } else {
            // User didn't like the story yet, add like
            await Story.findByIdAndUpdate(storyId, { $addToSet: { likes: decodedToken.id } });
        }

        // Send success response
        res.status(200).json({ message: 'Like updated successfully.' });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = { togglelike }
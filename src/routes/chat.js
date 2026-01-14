const express = require('express');
const { Chat } = require('../models/chat');
const { userAuth } = require('../middlewares/auth');

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const { targetUserId } = req.params;

        let chat = await Chat.findOne({ participants: {$all: [loggedInUser, targetUserId]}}).populate({
            path: "messages.senderId",
            select: "firstName lastName photoUrl"
        });
        if (!chat) {
            chat = new Chat({
                participants: [loggedInUser, targetUserId],
                messages: []
            });

            await chat.save();
        }

        res.json({message: "Chat fetched successfully", chat})
    } catch(err) {
        res.status(400).send("Chat couldn't be found");
    }
});

module.exports = chatRouter;

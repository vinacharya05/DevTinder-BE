const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const {User} = require('../models/user.js');

const userRouter = express.Router();

userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
    try {
        const toUserId = req.user._id;
        console.log("ToUserId ::", toUserId);
        const connectionRequests = await ConnectionRequest.find({
            toUserId,
            status: 'interested'
        }).populate('fromUserId', ["firstName", "lastName", "age", "photoUrl", "about"]);
       
        res.json({message: `Data fetched successfully`,
            data: connectionRequests
        });
    } catch(err) {
        console.log(err);
        res.status(500).send("Something went wrong")
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: 'accepted'},
                {toUserId: loggedInUser._id, status: 'accepted'},
            ]
        })
        .populate('fromUserId', "firstName lastName age photoUrl about")
        .populate('toUserId', "firstName lastName age photoUrl about")

        console.log("Connections ::", connections)
        const data = connections.map(connection => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId;
            }

            return connection.fromUserId;
        })

        res.json(data);

    } catch(err) {
        res.status(400).send("Connection not found")
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;
         const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
        
        const hideUserFromFeed = new Set();
        connectionRequests.forEach(row => {
            hideUserFromFeed.add(row.fromUserId);
            hideUserFromFeed.add(row.toUserId);
        });

        const feed = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id : {$ne: loggedInUser._id}}
            ]
        }).select("firstName lastName age photoUrl gender skills about")
        .skip(skip)
        .limit(limit)

        console.log(feed);
        res.json(feed);

    } catch(err) {
        console.log(err);
        res.status(400).send("Something went wrong" + err.message);
    }
});

module.exports = userRouter;
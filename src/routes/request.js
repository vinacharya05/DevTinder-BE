const express = require('express');
const {userAuth} = require('../middlewares/auth');
const Connection = require('../models/connectionRequest');
const { User } = require('../models/user');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
       const loggedInUser = req.user;
       const fromUserId = loggedInUser._id;
       const toUserId = req.params.toUserId;
       const status = req.params.status;

       const ALLOWED_STATUS = ["ignored", "interested"];
       if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Not a valid status " + status);
       }

       const toUser = await User.findById(toUserId);
       if (!toUser) {
        throw new Error("Not a valid user");
       }

       const existingConnection = await Connection.findOne({
        $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
       });

       if (existingConnection) {
        return res.status(500).send("Connection already exists");
       }

       const connection = new Connection({fromUserId, toUserId, status});

       const saveResponse = await connection.save();

       const message = status === 'interested' ? `${loggedInUser.firstName} interested in ${toUser.firstName}` : `${loggedInUser.firstName} rejected ${toUser.firstName}` 

       res.json({ message, data: saveResponse});
    } catch(err) {
        res.status(400).send("Error ::" + err.message)
    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;

        const ALLOWED_STATUS = ['accepted', 'rejected'];
        if (!ALLOWED_STATUS.includes(status)) {
            throw new Error("Not a valid status" + status);
        }

        const connection = await Connection.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if (!connection) {
            req.status(400).send("Connection request not found");
        }

        connection.status = status;
        await connection.save();
        res.send("Connection acknowledged succesfully");
    } catch(err) {
        res.status(400).send("Error ::" + err.message);
    }
    
});

module.exports = requestRouter;
const express = require('express');
const {userAuth} = require('../middlewares/auth');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async(req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(500).send(`Something went wrong ${err.message}`);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileUpdateData(req)) {
            throw new Error("Profile update request is invalid !!");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName} is updated successfully`,
            data: loggedInUser
        })
    } catch(err) {
        res.status(500).send(`Something went wrong ${err.message}`);
    }
   
});

module.exports = profileRouter;
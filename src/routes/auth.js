const express = require('express');
const validator = require('validator');
const {User} = require('../models/user');
const { validateSignUpForm } = require('../utils/validation');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post('/signup', async(req, res) => {
    const {firstName, lastName, emailId, password } = req.body;

    try {
        //Validate the request body
        validateSignUpForm(req);
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({firstName, lastName, emailId, password: passwordHash});
        await user.save();
        res.send("User is uccessfully created");
    } catch(err) {
        res.status(500).send(`Something went wrong ${err.message}`);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
       const {emailId, password} = req.body;
       if (!validator.isEmail(emailId)) {
            throw new Error("Invalid credentials");
       }

       const user = await User.findOne({emailId});
       if(!user) {
        throw new Error("Invalid credentials");
       }
       
       const isValidPassword = await user.isPasswordValid(password);
       if (isValidPassword) {
        const token = await user.getJWT();
        console.log("Token created")
        res.cookie('token', token, {expires: new Date(Date.now() + 900000)});
        res.send("Login is successful");
       } else {
        throw new Error("Invalid credentials");
       }

    } catch(err) {
        res.status(500).send(`Something went wrong ${err.message}`);
    }
});


authRouter.post('/logout', async (req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now())}).send("Logged out successfully!!!");

})

module.exports = authRouter;
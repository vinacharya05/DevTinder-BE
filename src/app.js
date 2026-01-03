const express = require('express');
const connectDB = require('./config/database');
const { User } = require('./models/user');
const { userAuth } = require('./middlewares/auth');
const validator = require('validator');
const { validateSignUpForm } = require('./utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async(req, res) => {
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

app.post('/login', async (req, res) => {
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

app.get('/profile', userAuth, async(req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(500).send(`Something went wrong ${err.message}`);
    }
});

app.post('/sendConnectionRequest', userAuth, (req, res) => {
    res.send("Connection request sent");
})



// Find user by emailId - Returns an array of users
app.get('/user', async(req, res) => {
    const email = req.body.emailId;

    try {
        const user = await User.find({emailId: email});
        if (user.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
        
    } catch(err) {
        res.status(500).send("Something went wrong");
    }
});

// Find user by emailId - Returns one user object
app.get('/user', async(req, res) => {
    const email = req.body.emailId;

    try {
        const user = await User.findOne({emailId: email});
        if (user.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
        
    } catch(err) {
        res.status(500).send("Something went wrong");
    }
});

// Find user by Id - Returns one user object
app.get('/userById', async(req, res) => {
    const id = req.query.id;
    console.log("IDD ::", id);
    try {
        const user = await User.findById(id);
        console.log("User ::", user);
        if (user.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
        
    } catch(err) {
        res.status(500).send("Something went wrong");
    }
});

app.delete('/user', async (req, res) => {
    const userId = req.query.id;

    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      console.log("Delete ::", deletedUser);
      res.send("User Deleted Successfully !");
    } catch(err) {
        res.status(500).send("Something went wrong");
    }
});

app.patch('/user/:userid', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
      const ALLOWED_UPDATES = ["skills", "gender", "about", "age"];
      const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
      if (!isUpdateAllowed) {
        throw new Error("User update failed");
      }

      if (data.skills?.length > 10) {
         throw new Error("Validation failed: Skills cannot be more than 10");
      }
      const updatedUser = await User.findByIdAndUpdate(userId, data, {runValidators: true});
      console.log("Update ::", updatedUser);
      res.send("User Updated Successfully !");
    } catch(err) {
        res.status(500).send("User update failed" + err.message);
    }
});

app.get('/feed', async(req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(err) {
        res.status(500).send("something went wrong");
    }
});



connectDB().then(() => {
    console.log("Database connection successfully established ...");
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch(() => console.log("Database connection not established ..."))


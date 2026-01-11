const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            return res.status(401).send("Please login");
        }
        
        const decodedObj = await jwt.verify(token, "Dev@Tinder$");
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("Token is invalid");
        } 

        req.user = user;
        next();

    } catch(err) {
        console.log("Eroror:: ", err.message);
        res.status(401).send('Unauthorized access');
    }
    
};

module.exports = {userAuth};
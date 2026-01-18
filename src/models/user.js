const {Schema, model} = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: true, minLength: 3, maxLength: 50},
    lastName: {type: String},
    emailId: {type: String, required: true, unique: true, lowercase: true, trim: true, validate(value) {
        if (!validator.isEmail(value)) {
            throw new Error("Email is not valid")
        }
    }},
    age: {type: Number, min: 18},
    gender: {
        type: String, 
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    password: {
        type: String
    },
    about: {type: String, default: 'This is a default about for user'},
    skills: {type: [String]},
    photoUrl: {type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbW-7mOJGYAqpAytNDyG0eE-KOWxqBDGnL-9hGPX6sPA&s", validate(value) {
        if (!validator.isURL(value)) {
            throw new Error("Not a valid image url");
        }
    }}
}, {timestamps: true});

userSchema.methods.getJWT = async function() {
    const token =  await jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    return token;
}

userSchema.methods.isPasswordValid = async function(passwordInputByUser) {
    return await bcrypt.compare(passwordInputByUser, this.password);
}

const User = model('User', userSchema);

module.exports = {User};
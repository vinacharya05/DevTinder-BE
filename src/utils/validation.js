const validator = require('validator');

const validateSignUpForm = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is invalid");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is invalid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Email is invalid");
    }
}

const validateProfileUpdateData = (req) => {
    const ALLOWED_FOR_UPDATE = ["gender", "age", "about", "firstName", "lastname", "skills", "photoUrl"];
    return Object.keys(req.body).every(k => ALLOWED_FOR_UPDATE.includes(k));
}

module.exports = {validateSignUpForm, validateProfileUpdateData};
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

module.exports = {validateSignUpForm};
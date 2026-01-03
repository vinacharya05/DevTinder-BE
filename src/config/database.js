const mongoose = require('mongoose');

const connectDB = async () => mongoose.connect("mongodb+srv://vinayaacharya:ZwelR249YhclewB0@node.83iyicc.mongodb.net/devTinder");


module.exports = connectDB;
const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

const app = express();

// app.use('/', (req, res) => {
//     res.send("Hello from / !!!");
// });

// app.get(/.*fly/,(req, res) => {
//     res.send("Executed");
// });

// app.get('/user/:id/:name',(req, res) => {
//     console.log("Path param", req.params);
//     res.send({name: "Vinay", age: 24});
// });

// app.get('/user',(req, res) => {
//     console.log("Dynamic query param", req.query);
//     res.send({name: "Vinay111", age: 24});
// });

app.use('/admin', adminAuth);

app.get('/admin/getAllData', (req, res, next) => {
    res.send("Getting all admin data");
});

app.get('/admin/deleteAllData', (req, res, next) => {

        res.send("Delete all admin data");

});
 
app.get('/user', userAuth, (req, res, next) => {
    console.log("First handler");
    next();
});

app.get('/user', (req, res, next) => {
    console.log("First handler");
    res.send("Request habdler 2 got executed")
});

app.delete('/user',(req, res) => {
    res.send("User deleted successfully");
});


app.listen(7777, () => {
    console.log('Server is running on port 7777');
})
const express = require('express');

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

app.get('/user', [(req, res, next) => {
    next();
},
(req, res, next) => {
    next();
}],
(req, res, next) => {
    res.send("Response 3");
    next();
},
(req, res, next) => {
    next();
});


app.delete('/user',(req, res) => {
    res.send("User deleted successfully");
});


app.listen(7777, () => {
    console.log('Server is running on port 7777');
})
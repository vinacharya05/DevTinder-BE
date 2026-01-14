const express = require('express');
const connectDB = require('./config/database');
const { User } = require('./models/user');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const cors = require('cors');
const http = require('http');
const socket = require('socket.io');
const initializeSocket = require('./utils/socket');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', chatRouter);

const server = http.createServer(app);
initializeSocket(server);


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
    server.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch(() => console.log("Database connection not established ..."));

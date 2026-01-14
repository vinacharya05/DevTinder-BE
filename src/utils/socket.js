const socket = require('socket.io');
const crypto = require('crypto');
const { Chat } = require('../models/chat');
const connectionRequest = require('../models/connectionRequest');


const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });

    io.on('connection', (socket) => {
        //Handle Events
        socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName + "Joined room", roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ firstName, lastName, photoUrl, userId, targetUserId, text }) => {
            try {
                const connection = await connectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
                    ]
                });

                if (connection) {
                    let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
                    if (!chat) {
                        chat = new Chat({
                            participants: [userId, targetUserId],
                            messages: []
                        });
                    }

                    chat.messages.push({ senderId: userId, text });
                    await chat.save();
                    const roomId = getSecretRoomId(userId, targetUserId);
                    io.to(roomId).emit("messageRecieved", { firstName, lastName, photoUrl, text });
                }

            } catch (err) {
                console.log("ERR ::", err.message);
            }
        });

        socket.on("disconnect", () => {

        });
    })
}

module.exports = initializeSocket;
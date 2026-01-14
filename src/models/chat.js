
const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, {timestamps: true});

const chatShema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [messageSchema]
});

const Chat = model("Chat", chatShema);

module.exports = {Chat}

const {Schema, model} = require('mongoose');

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {type: String,
    enum: {
      values: ['interested', 'ignored', 'accepted', 'rejected'],
      message: '{VALUE} is not a supported status'
    }}
}, {timestamps: true});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre('save', function() {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Cannot send request to yourself");
    }
});

module.exports = model('CoonectionRequest', connectionRequestSchema);
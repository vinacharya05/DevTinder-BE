const {Schema, model} = require('mongoose');

const connectionRequestSchema = new Schema({
    formUserId: {
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

connectionRequestSchema.index({formUserId: 1, toUserId: 1});

connectionRequestSchema.pre('save', function() {
    if (this.formUserId.equals(this.toUserId)) {
        throw new Error("Cannot send request to yourself");
    }

    next();
})

module.exports = model('CoonectionRequest', connectionRequestSchema);
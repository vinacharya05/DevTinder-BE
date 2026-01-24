const {Schema, model} = require('mongoose');

const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    notes: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
        },
        membershipType: {
            type: String,
        },
    }
}, {timestamps: true});

module.exports = model("Payment", paymentSchema);
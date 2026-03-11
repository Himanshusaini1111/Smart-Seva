const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({

    service: {
        type: String, required: true
    },
    serviceid: {
        type: String, required: true
    },
    userid: {
        type: String, required: true

    },
    fromdate: {
        type: String, required: true

    },
    todate: {
        type: String, required: true

    },
    totalAmount: {
        type: String, required: true
    }
    ,
    totaldays: {
        type: String, required: true

    },

    status: {
        type: String, required: true, default: 'booked'
    },
    comments: [
        {
            text: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true,

},
)

const bookingmodel = mongoose.model('bookings', bookingSchema);

module.exports = bookingmodel
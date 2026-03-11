const mongoose = require("mongoose");

var mongoURL = "mongodb+srv://servicehunt:service0987654321@cluster0.u0b3u.mongodb.net/service?retryWrites=true&w=majority";

mongoose.set('strictQuery', true); // Suppress the warning

mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('Mongo DB Connection Successful'))
    .catch((err) => console.log('Mongo DB connection failed', err));

module.exports = mongoose;

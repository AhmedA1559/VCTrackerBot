const mongoose = require('mongoose');

module.exports.userSchema = new mongoose.Schema({
    id: Number,
    timeranges: [
        {
            joinTime: Date,
            leaveTime: Date
        }
    ]
});
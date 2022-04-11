const mongoose = require('mongoose');
const { userSchema } = require('./User');

module.exports.sessionSchema = new mongoose.Schema({
    joinTime: Date,
    leaveTime: Date,
    timeranges: [
        userSchema
    ]
});
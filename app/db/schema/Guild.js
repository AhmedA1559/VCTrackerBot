const mongoose = require('mongoose');
const { sessionSchema } = require('./Session');
const { userSchema } = require('./User');

module.exports.guildSchema = new mongoose.Schema({
    id: Number,
    joinTime: Date,
    leaveTime: Date,
    currentSession: [
        userSchema
    ],
    history: [
        sessionSchema
    ]
});

module.exports.Guild = mongoose.model('Guild', this.guildSchema);
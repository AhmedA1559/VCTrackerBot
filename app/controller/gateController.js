const { getGuild } = require("../db/databaseController");

module.exports.logJoin = async function(userId, guildId) {
    let guild = await getGuild(guildId);

    if (!guild.joinTime) {
        guild.joinTime = Date.now();
    }

    let match = guild.currentSession.find(session => session.id == userId);
    if (match) {
        match.timeranges.push({
            joinTime: Date.now()
        });
    } else {
        guild.currentSession.push({
            id: userId,
            timeranges: {
                joinTime: Date.now()
            }
        });
    }
    await guild.save();
}

module.exports.logLeave = async function(userId, guildId, channelEmpty) {
    let guild = await getGuild(guildId);

    let match = guild.currentSession.find(session => session.id == userId);
    if (match) {
        match.timeranges[match.timeranges.length-1].leaveTime = Date.now();
    } else {
        guild.currentSession.push({
            id: userId,
            timeranges: {
                leaveTime: Date.now()
            }
        });
    }

    if (channelEmpty) {
        guild.leaveTime = Date.now();
        moveToArchive(guild);
    }

    await guild.save();
}

module.exports.getTime = async function(userId, guildId) {
    let guild = await getGuild(guildId);

    return getCurrentSessionTime() + getHistoryTime(); // returns ms

    function getCurrentSessionTime() {
        let match = guild.currentSession.find(session => session.id == userId); // to:do refactor this

        if (!match) return 0;

        var deltaTime = 0;

        match.timeranges.forEach((log) => {
            if (log.leaveTime && log.joinTime) {
                deltaTime += (log.leaveTime.getTime()) - (log.joinTime.getTime());
            } else if (log.joinTime) {
                deltaTime += Date.now() - (log.joinTime.getTime()); // assume they are still in vc
            }
        });
        return deltaTime;
    }

    function getHistoryTime() {
        var deltaTime = 0;

        guild.history.forEach( (value) => {
            let match = value.timeranges.find(session => session.id == userId); // to:do refactor this

            if (!match) return;

            match.timeranges.forEach((log) => {
                if (log.leaveTime && log.joinTime) {
                    deltaTime += (log.leaveTime.getTime()) - (log.joinTime.getTime());
                }
            });
        });

        return deltaTime;
    }
}

function moveToArchive(guild) {
    guild.history.push({
        joinTime: guild.joinTime,
        leaveTime: guild.leaveTime,
        timeranges: guild.currentSession
    });

    guild.joinTime = null;
    guild.leaveTime = null;
    guild.currentSession = [];
}
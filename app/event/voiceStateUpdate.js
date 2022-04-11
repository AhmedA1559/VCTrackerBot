const { logJoin, logLeave } = require("../controller/gateController");

module.exports = (oldState, newState) => {
    if (oldState.member.user.bot || newState.member.user.bot) return;
  
    if (newState.channel === null) {
      let channelEmpty = oldState.channel.members.filter(member => !member.user.bot).size == 0;
      logLeave(oldState.member.user.id, oldState.guild.id, channelEmpty);
      console.log("user left channel", oldState.member.user.id);
    } else if (oldState.channel === null) {
      // joined
      logJoin(newState.member.user.id, newState.guild.id);
      console.log("user joined channel", newState.member.user.id);
    // moved
    } else {
      console.log(
        "user moved channels",
        oldState.channel.channelID,
        newState.channel.channelID
      );
    }
    
  };
const { Guild } = require("./schema/Guild");

module.exports.getGuild = async function (id) {
  let guild = await Guild.findOne({ id: id });
  if (guild) return guild;
  else {
    guild = new Guild({ id: id });
    await guild.save().catch((e) => console.log(e));
    return guild;
  }
};

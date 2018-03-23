const { Listener } = require("discord-akairo");
const logger = require("../logger");
const { TrackedRole, UserInfo } = require("../models");
const Sequelize = require("sequelize");

class BookmarkIncrementListener extends Listener {
  constructor() {
    super("bookmark-increment", {
      emitter: "client",
      eventName: "guildMemberUpdate"
    });
  }

  async exec(oldMember, newMember) {
    logger.info(`roles for user ${oldMember.id} changed`);

    try {
      const addedRoles = newMember.roles.filter(
        role => !oldMember.roles.has(role.id)
      );

      if (addedRoles.size > 0) {
        const [userInfo] = await UserInfo.findOrCreate({
          where: { user_id: oldMember.id, guild: oldMember.guild.id },
          defaults: { user_id: oldMember.id, guild: oldMember.guild.id }
        });

        let trackedRoles = await TrackedRole.findAll({
          where: {
            guild: oldMember.guild.id,
            role: {
              [Sequelize.Op.and]: {
                [Sequelize.Op.in]: addedRoles.map(role => role.id),
                [Sequelize.Op.notIn]: userInfo.trackedRolesUsed
              }
            }
          }
        });

        if (trackedRoles.length > 0) {
          const total = trackedRoles.reduce(
            (memo, role) => memo + role.weight,
            0
          );

          await userInfo.update({
            bookmarks: userInfo.bookmarks + total,
            trackedRolesUsed: userInfo.trackedRolesUsed.concat(
              trackedRoles.map(trackedRoles => trackedRoles.role)
            )
          });

          logger.info(`adding ${total} to user ${oldMember.id} bookmarks`);
        } else {
          logger.info(`no roles tracked for added roles`);
        }
      } else {
        logger.info(`no new roles for user ${oldMember.id}`);
      }
    } catch (error) {
      logger.error(error.message);
    }
  }
}

module.exports = BookmarkIncrementListener;

import { GuildMember } from "discord.js";
import { APIMember } from "revolt-toolset";
import mapAttachment from "./attachment";
import { snowflakeToULID } from "./ulid";

export default function mapMember(member: GuildMember): APIMember {
  return {
    _id: {
      server: snowflakeToULID(member.guild.id),
      user: snowflakeToULID(member.id),
    },
    joined_at: member.joinedAt.toISOString(),
    nickname: member.nickname ?? null,
    avatar: mapAttachment(member.id, member.avatarURL({ size: 256, extension: "png" })),
    roles: member.roles.cache.map((r) => snowflakeToULID(r.id)),
    timeout: member.communicationDisabledUntil
      ? member.communicationDisabledUntil.toISOString()
      : null,
  };
}

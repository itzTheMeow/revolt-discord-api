import { FormattingPatterns, Message, MessageMentions } from "discord.js";
import LZString from "lz-string";
import { APIMessage } from "revolt-toolset";
import mapAttachment from "./attachment";
import { snowflakeToULID } from "./ulid";

export default function mapMessage(message: Message): APIMessage {
  return {
    _id: snowflakeToULID(message.id),
    content:
      message.content
        ?.replace(
          new RegExp(MessageMentions.UsersPattern, "g"),
          (_, id) => `<@${snowflakeToULID(id)}>`
        )
        .replace(
          new RegExp(MessageMentions.ChannelsPattern, "g"),
          (_, id) => `<#${snowflakeToULID(id)}>`
        )
        .replace(
          new RegExp(MessageMentions.RolesPattern, "g"),
          (_, id) => `@${message.guild?.roles.cache.get(id)?.name || `Role_${id}`}`
        )
        .replace(
          new RegExp(FormattingPatterns.Emoji, "g"),
          (_, __, ___, id) => `:${snowflakeToULID(id)}:`
        ) || null,
    author: snowflakeToULID(message.author.id),
    attachments: message.attachments.map((a) =>
      mapAttachment(a.id, a.url, a.width, a.height, a.size)
    ),
    channel: snowflakeToULID(message.channelId),
    edited: message.editedAt?.toISOString() ?? null,
    embeds: null, //TODO:
    interactions: null, //TODO:
    masquerade: message.webhookId
      ? { name: message.author.username, avatar: message.author.displayAvatarURL() }
      : null,
    mentions: null, //TODO:
    nonce: LZString.decompress(String(message.nonce)),
    reactions: null, //TODO:
    replies: null, //TODO:
    system: null, //TODO:
  };
}

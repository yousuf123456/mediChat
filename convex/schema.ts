import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    isGroup: v.boolean(),
    lastMessagedAt: v.optional(v.int64()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    usersTyping: v.array(v.string()),
    userIds: v.array(v.string()),
  }),

  userConversationRelation: defineTable({
    userId: v.string(),
    conversationId: v.id("conversations"),
  }),

  messages: defineTable({
    body: v.optional(v.string()),
    image: v.optional(v.string()),
    conversationId: v.id("conversations"),
    senderId: v.string(),
    senderName: v.string(),
    seenUserIds: v.array(v.string()),
  }),

  presence: defineTable({
    user: v.string(),
    room: v.string(),
    present: v.boolean(),
    latestJoin: v.number(),
    data: v.any(),
  }).index("room_present_user", ["room", "present", "user"]),

  presence_heartbeats: defineTable({
    user: v.string(),
    updated: v.number(),
  }).index("by_user", ["user"]),
});

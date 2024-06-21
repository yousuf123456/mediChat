import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getAllOrThrow } from "convex-helpers/server/relationships";

export const get = query({
  args: { conversationId: v.string() },
  handler: async (ctx, args) => {
    const { conversationId } = args;

    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), conversationId))
      .first();

    return conversation;
  },
});

export const create = mutation({
  args: {
    userIds: v.array(v.string()),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userIds: otherUserIds, isGroup, groupName } = args;
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const conversationUserIds = [...otherUserIds, identity.subject];

    if (!isGroup) {
      const currentUserConversationIds = (
        await ctx.db
          .query("userConversationRelation")
          .filter((q) => q.eq(q.field("userId"), identity.subject))
          .collect()
      ).map((relation) => relation.conversationId);

      const currentUserConversations = await getAllOrThrow(
        ctx.db,
        currentUserConversationIds
      );

      const existingConversation = currentUserConversations.filter(
        (conversation) =>
          !conversation.isGroup &&
          conversation.userIds.includes(otherUserIds[0])
      )[0];

      if (existingConversation) {
        return existingConversation._id;
      }
    }

    const createdConversatonId = await ctx.db.insert("conversations", {
      isGroup,
      usersTyping: [],
      name: groupName,
      userIds: conversationUserIds,
    });

    await Promise.all(
      conversationUserIds.map((userId) => {
        ctx.db.insert("userConversationRelation", {
          conversationId: createdConversatonId,
          userId,
        });
      })
    );

    return createdConversatonId;
  },
});

export const getOtherUserIds = query({
  args: {
    conversationId: v.string(),
    currentUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const { conversationId, currentUserId } = args;

    const otherUserIds = (
      await ctx.db
        .query("userConversationRelation")
        .filter((q) =>
          q.and(
            q.eq(q.field("conversationId"), conversationId),
            q.neq(q.field("userId"), currentUserId)
          )
        )
        .collect()
    ).map((otherUserIdRel) => otherUserIdRel.userId);

    return otherUserIds;
  },
});

export const getMessages = query({
  args: {
    conversationId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { conversationId, paginationOpts } = args;
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const results = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), conversationId))
      .order("desc")
      .paginate(paginationOpts);

    return results;
  },
});

export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const { conversationId } = args;
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const conversationRelationIds = (
      await ctx.db
        .query("userConversationRelation")
        .filter((q) => q.eq(q.field("conversationId"), conversationId))
        .collect()
    ).map((relation) => relation._id);
    const conversationMessageIds = (
      await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("conversationId"), conversationId))
        .collect()
    ).map((message) => message._id);

    const relationsDeletePromises = conversationRelationIds.map((relationId) =>
      ctx.db.delete(relationId)
    );
    const messagesDeletePromises = conversationMessageIds.map((messageId) =>
      ctx.db.delete(messageId)
    );

    await ctx.db.delete(conversationId);
    await Promise.all([...relationsDeletePromises, ...messagesDeletePromises]);

    return "Deleted the conversation";
  },
});

export const message = mutation({
  args: {
    conversationId: v.id("conversations"),
    message: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { conversationId, message, image } = args;
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const createdMessageId = await ctx.db.insert("messages", {
      image,
      body: message,
      conversationId,
      senderId: identity.subject,
      seenUserIds: [identity.subject],
      senderName: identity.givenName || "unknown",
    });

    return createdMessageId;
  },
});

export const seenMessage = mutation({
  args: {
    messageId: v.id("messages"),
    prevSeenUserIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { messageId, prevSeenUserIds } = args;
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(messageId, {
      seenUserIds: [...prevSeenUserIds, identity.subject],
    });
  },
});

import { query } from "./_generated/server";
import { getAllOrThrow } from "convex-helpers/server/relationships";
import { Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const conversationIds = (
      await ctx.db
        .query("userConversationRelation")
        .filter((q) => q.eq(q.field("userId"), identity?.subject))
        .collect()
    ).map(
      (userConversationRel) => userConversationRel.conversationId
    ) as Id<"conversations">[];

    const conversations = await getAllOrThrow(ctx.db, conversationIds);

    return conversations;
  },
});

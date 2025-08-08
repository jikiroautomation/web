import { ConvexError, v } from "convex/values";
import { mutation, query, MutationCtx } from "./_generated/server";

// Helper function to check if user is admin
const requireAdmin = async (ctx: MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("User not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user || user.role !== "admin") {
    throw new ConvexError("Admin access required");
  }

  return user;
};

// Queries - accessible to all authenticated users
export const getAllServices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("services").collect();
  },
});

export const getServiceById = query({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.serviceId);
  },
});

// Mutations - only accessible to admins
export const createService = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const now = Date.now();
    const serviceId = await ctx.db.insert("services", {
      name: args.name,
      description: args.description,
      emoji: args.emoji,
      createdAt: now,
      updatedAt: now,
    });

    return serviceId;
  },
});

export const updateService = mutation({
  args: {
    serviceId: v.id("services"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    emoji: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existingService = await ctx.db.get(args.serviceId);
    if (!existingService) {
      throw new ConvexError("Service not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updateData.name = args.name;
    if (args.description !== undefined)
      updateData.description = args.description;
    if (args.emoji !== undefined) updateData.emoji = args.emoji;

    await ctx.db.patch(args.serviceId, updateData);
    return args.serviceId;
  },
});

export const deleteService = mutation({
  args: {
    serviceId: v.id("services"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existingService = await ctx.db.get(args.serviceId);
    if (!existingService) {
      throw new ConvexError("Service not found");
    }

    await ctx.db.delete(args.serviceId);
    return { success: true };
  },
});

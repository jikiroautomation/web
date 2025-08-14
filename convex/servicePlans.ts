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

// Query - Get all plans by service ID
export const getServicePlansByServiceId = query({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("servicePlans")
      .withIndex("by_service_id", (q) => q.eq("serviceId", args.serviceId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();
  },
});

// Query - Get all active plans by service ID (public)
export const getActiveServicePlans = query({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("servicePlans")
      .withIndex("by_service_and_active", (q) => 
        q.eq("serviceId", args.serviceId).eq("isActive", true)
      )
      .order("asc")
      .collect();
  },
});

// Query - Get plan by ID
export const getPlanById = query({
  args: { planId: v.id("servicePlans") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.planId);
  },
});

// Mutation - Create service plan
export const createServicePlan = mutation({
  args: {
    serviceId: v.id("services"),
    planName: v.string(),
    description: v.string(),
    price: v.number(),
    billingPeriod: v.union(
      v.literal("monthly"),
      v.literal("yearly"), 
      v.literal("lifetime")
    ),
    items: v.array(v.string()),
    isPopular: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Check if service exists
    const service = await ctx.db.get(args.serviceId);
    if (!service) {
      throw new ConvexError("Service not found");
    }

    const now = Date.now();
    const planId = await ctx.db.insert("servicePlans", {
      serviceId: args.serviceId,
      planName: args.planName,
      description: args.description,
      price: args.price,
      billingPeriod: args.billingPeriod,
      items: args.items,
      isPopular: args.isPopular || false,
      sortOrder: args.sortOrder || 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return planId;
  },
});

// Mutation - Update service plan
export const updateServicePlan = mutation({
  args: {
    planId: v.id("servicePlans"),
    planName: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    billingPeriod: v.optional(v.union(
      v.literal("monthly"),
      v.literal("yearly"),
      v.literal("lifetime")
    )),
    items: v.optional(v.array(v.string())),
    isPopular: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existingPlan = await ctx.db.get(args.planId);
    if (!existingPlan) {
      throw new ConvexError("Service plan not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.planName !== undefined) updateData.planName = args.planName;
    if (args.description !== undefined) updateData.description = args.description;
    if (args.price !== undefined) updateData.price = args.price;
    if (args.billingPeriod !== undefined) updateData.billingPeriod = args.billingPeriod;
    if (args.items !== undefined) updateData.items = args.items;
    if (args.isPopular !== undefined) updateData.isPopular = args.isPopular;
    if (args.sortOrder !== undefined) updateData.sortOrder = args.sortOrder;
    if (args.isActive !== undefined) updateData.isActive = args.isActive;

    await ctx.db.patch(args.planId, updateData);
    return args.planId;
  },
});

// Mutation - Delete service plan
export const deleteServicePlan = mutation({
  args: {
    planId: v.id("servicePlans"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existingPlan = await ctx.db.get(args.planId);
    if (!existingPlan) {
      throw new ConvexError("Service plan not found");
    }

    await ctx.db.delete(args.planId);
    return { success: true };
  },
});

// Mutation - Soft delete (set isActive to false)
export const deactivateServicePlan = mutation({
  args: {
    planId: v.id("servicePlans"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existingPlan = await ctx.db.get(args.planId);
    if (!existingPlan) {
      throw new ConvexError("Service plan not found");
    }

    await ctx.db.patch(args.planId, {
      isActive: false,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
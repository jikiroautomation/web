import { ConvexError, v } from "convex/values";
import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";

// Helper function to get current user
const getCurrentUser = async (ctx: MutationCtx | QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("User not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) {
    throw new ConvexError("User not found");
  }

  return user;
};

// Helper function to check if user is admin
const requireAdmin = async (ctx: MutationCtx) => {
  const user = await getCurrentUser(ctx);
  if (user.role !== "admin") {
    throw new ConvexError("Admin access required");
  }
  return user;
};

// Helper function to calculate end date based on billing period
const calculateEndDate = (
  startDate: number,
  billingPeriod: string,
): number | undefined => {
  if (billingPeriod === "lifetime") {
    return undefined;
  }

  const start = new Date(startDate);
  if (billingPeriod === "monthly") {
    start.setMonth(start.getMonth() + 1);
  } else if (billingPeriod === "yearly") {
    start.setFullYear(start.getFullYear() + 1);
  }

  return start.getTime();
};

// Query - Get user's enrolled services
export const getUserEnrolledServices = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    return await ctx.db
      .query("enrolledServices")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Query - Get user's enrolled services with service and plan details
export const getUserEnrolledServicesWithDetails = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    const enrollments = await ctx.db
      .query("enrolledServices")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();

    // Get service and plan details for each enrollment
    const enrollmentsWithDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        const service = await ctx.db.get(enrollment.serviceId);
        const plan = await ctx.db.get(enrollment.planId);

        return {
          ...enrollment,
          service,
          plan,
        };
      })
    );

    return enrollmentsWithDetails;
  },
});

// Query - Get enrolled service by ID
export const getEnrolledServiceById = query({
  args: { enrollmentId: v.id("enrolledServices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const enrollment = await ctx.db.get(args.enrollmentId);

    if (!enrollment) {
      throw new ConvexError("Enrollment not found");
    }

    // Users can only view their own enrollments, admins can view all
    if (user.role !== "admin" && enrollment.userId !== user._id) {
      throw new ConvexError("Access denied");
    }

    return enrollment;
  },
});

// Query - Check if user is already enrolled in a service
export const checkUserEnrollment = query({
  args: {
    serviceId: v.id("services"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const targetUserId = args.userId || user._id;

    // Only allow checking own enrollment unless admin
    if (user.role !== "admin" && targetUserId !== user._id) {
      throw new ConvexError("Access denied");
    }

    const activeEnrollment = await ctx.db
      .query("enrolledServices")
      .withIndex("by_user_and_service", (q) =>
        q.eq("userId", targetUserId).eq("serviceId", args.serviceId),
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    return {
      isEnrolled: !!activeEnrollment,
      enrollment: activeEnrollment,
    };
  },
});

// Mutation - Create enrollment (for testing without payment)
export const createEnrollment = mutation({
  args: {
    serviceId: v.id("services"),
    planId: v.id("servicePlans"),
    paymentMethod: v.optional(
      v.union(
        v.literal("manual"),
        v.literal("stripe"),
        v.literal("midtrans"),
        v.literal("xendit"),
        v.literal("other"),
      ),
    ),
    transactionId: v.optional(v.string()),
    paymentGatewayData: v.optional(v.any()),
    isTestMode: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Validate service exists
    const service = await ctx.db.get(args.serviceId);
    if (!service) {
      throw new ConvexError("Service not found");
    }

    // Validate plan exists and belongs to service
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new ConvexError("Plan not found");
    }
    if (plan.serviceId !== args.serviceId) {
      throw new ConvexError("Plan does not belong to this service");
    }
    if (!plan.isActive) {
      throw new ConvexError("Plan is not active");
    }

    // Check if user is already enrolled and active
    const existingEnrollment = await ctx.db
      .query("enrolledServices")
      .withIndex("by_user_and_service", (q) =>
        q.eq("userId", user._id).eq("serviceId", args.serviceId),
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (existingEnrollment) {
      throw new ConvexError("User is already enrolled in this service");
    }

    const now = Date.now();
    const startDate = now;
    const endDate = calculateEndDate(startDate, plan.billingPeriod);
    const nextBillingDate =
      plan.billingPeriod !== "lifetime" ? endDate : undefined;

    // Create enrollment
    const enrollmentId = await ctx.db.insert("enrolledServices", {
      userId: user._id,
      serviceId: args.serviceId,
      planId: args.planId,
      status: args.isTestMode ? "active" : "pending",
      paymentStatus: args.isTestMode ? "test" : "pending",
      paymentMethod: args.paymentMethod || "manual",
      transactionId: args.transactionId,
      paymentGatewayData: args.paymentGatewayData,
      amount: plan.price,
      currency: "IDR", // Default currency, bisa dijadikan parameter nanti
      billingPeriod: plan.billingPeriod,
      startDate,
      endDate,
      nextBillingDate,
      autoRenew: plan.billingPeriod !== "lifetime", // Auto renew for non-lifetime plans
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return enrollmentId;
  },
});

// Mutation - Update enrollment status (mainly for payment confirmation)
export const updateEnrollmentStatus = mutation({
  args: {
    enrollmentId: v.id("enrolledServices"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("active"),
        v.literal("expired"),
        v.literal("cancelled"),
        v.literal("failed"),
      ),
    ),
    paymentStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("paid"),
        v.literal("failed"),
        v.literal("refunded"),
        v.literal("test"),
      ),
    ),
    transactionId: v.optional(v.string()),
    paymentGatewayData: v.optional(v.any()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const enrollment = await ctx.db.get(args.enrollmentId);

    if (!enrollment) {
      throw new ConvexError("Enrollment not found");
    }

    // Users can only update their own enrollments, admins can update all
    if (user.role !== "admin" && enrollment.userId !== user._id) {
      throw new ConvexError("Access denied");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.status !== undefined) updateData.status = args.status;
    if (args.paymentStatus !== undefined)
      updateData.paymentStatus = args.paymentStatus;
    if (args.transactionId !== undefined)
      updateData.transactionId = args.transactionId;
    if (args.paymentGatewayData !== undefined)
      updateData.paymentGatewayData = args.paymentGatewayData;
    if (args.notes !== undefined) updateData.notes = args.notes;

    await ctx.db.patch(args.enrollmentId, updateData);
    return args.enrollmentId;
  },
});

// Mutation - Cancel enrollment
export const cancelEnrollment = mutation({
  args: {
    enrollmentId: v.id("enrolledServices"),
    cancelReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const enrollment = await ctx.db.get(args.enrollmentId);

    if (!enrollment) {
      throw new ConvexError("Enrollment not found");
    }

    // Users can only cancel their own enrollments, admins can cancel all
    if (user.role !== "admin" && enrollment.userId !== user._id) {
      throw new ConvexError("Access denied");
    }

    if (enrollment.status === "cancelled") {
      throw new ConvexError("Enrollment is already cancelled");
    }

    const now = Date.now();
    await ctx.db.patch(args.enrollmentId, {
      status: "cancelled",
      cancelledAt: now,
      cancelReason: args.cancelReason || "User requested cancellation",
      updatedAt: now,
    });

    return args.enrollmentId;
  },
});

// Admin Query - Get all enrollments
export const getAllEnrollments = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("active"),
        v.literal("expired"),
        v.literal("cancelled"),
        v.literal("failed"),
      ),
    ),
    paymentStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("paid"),
        v.literal("failed"),
        v.literal("refunded"),
        v.literal("test"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError("Admin access required");
    }

    if (args.status !== undefined) {
      return await ctx.db
        .query("enrolledServices")
        .withIndex("by_status", (q) =>
          q.eq(
            "status",
            args.status as
              | "pending"
              | "active"
              | "expired"
              | "cancelled"
              | "failed",
          ),
        )
        .collect();
    } else if (args.paymentStatus !== undefined) {
      return await ctx.db
        .query("enrolledServices")
        .withIndex("by_payment_status", (q) =>
          q.eq(
            "paymentStatus",
            args.paymentStatus as
              | "pending"
              | "paid"
              | "failed"
              | "refunded"
              | "test",
          ),
        )
        .collect();
    } else {
      return await ctx.db.query("enrolledServices").collect();
    }
  },
});

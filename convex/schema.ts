import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
  services: defineTable({
    name: v.string(),
    description: v.string(),
    emoji: v.string(),
    isNew: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_name", ["name"]),
  servicePlans: defineTable({
    serviceId: v.id("services"),
    planName: v.string(),
    description: v.string(),
    price: v.number(),
    billingPeriod: v.union(
      v.literal("monthly"),
      v.literal("yearly"),
      v.literal("lifetime"),
    ),
    items: v.array(v.string()),
    isPopular: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_service_id", ["serviceId"])
    .index("by_service_and_active", ["serviceId", "isActive"]),
  enrolledServices: defineTable({
    userId: v.id("users"),
    serviceId: v.id("services"),
    planId: v.id("servicePlans"),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("expired"),
      v.literal("cancelled"),
      v.literal("failed")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded"),
      v.literal("test")
    ),
    paymentMethod: v.optional(v.union(
      v.literal("manual"),
      v.literal("stripe"),
      v.literal("midtrans"),
      v.literal("xendit"),
      v.literal("other")
    )),
    transactionId: v.optional(v.string()),
    paymentGatewayData: v.optional(v.any()),
    amount: v.number(),
    currency: v.string(),
    billingPeriod: v.union(
      v.literal("monthly"),
      v.literal("yearly"),
      v.literal("lifetime"),
    ),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    nextBillingDate: v.optional(v.number()),
    autoRenew: v.boolean(),
    cancelledAt: v.optional(v.number()),
    cancelReason: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_service_id", ["serviceId"])
    .index("by_user_and_service", ["userId", "serviceId"])
    .index("by_status", ["status"])
    .index("by_payment_status", ["paymentStatus"])
    .index("by_transaction_id", ["transactionId"]),
});

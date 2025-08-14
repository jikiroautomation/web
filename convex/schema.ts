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
});

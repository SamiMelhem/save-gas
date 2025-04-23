import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  gasStations: defineTable({
    name: v.string(),
    address: v.optional(v.string()),
    vicinity: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    prices: v.object({
      regular: v.number(),
      midgrade: v.number(),
      premium: v.number(),
      diesel: v.number(),
    }),
    lastUpdated: v.number(),
    place_id: v.optional(v.string()),
    placeId: v.optional(v.string()),
    rating: v.number(),
    user_ratings_total: v.optional(v.number()),
    userRatingsTotal: v.optional(v.number()),
    openNow: v.optional(v.boolean()),
    state: v.string(),
    cacheTimestamp: v.optional(v.number()),
  }),
});

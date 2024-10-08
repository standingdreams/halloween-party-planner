import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const createEvent = mutation({
  args: {
    eventName: v.string(),
    eventDescription: v.string(),
    eventDate: v.string(),
    city: v.string(),
    country: v.string(),
    postalCode: v.string(),
    region: v.string(),
    streetAddress: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('events', {
      eventName: args.eventName,
      eventDescription: args.eventDescription,
      eventDate: args.eventDate,
      city: args.city,
      country: args.country,
      postalCode: args.postalCode,
      region: args.region,
      streetAddress: args.streetAddress,
    });
  },
});

export const getEvent = query({
  args: {
    id: v.id('events'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    await ctx.db.insert('events', {
      body: args.storageId,
      format: 'image',
    });
  },
});

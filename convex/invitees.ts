import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const addInvitees = mutation({
  args: {
    emails: v.array(v.string()),
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    const inviteeData = args.emails.map((email) => ({
      email,
      eventId: args.eventId,
    }));

    return Promise.all(
      inviteeData.map(async (invitee) => {
        return await ctx.db.insert('invitees', invitee);
      }),
    );
  },
});

export const getInvitees = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('invitees')
      .filter((q) => q.eq(q.field('eventId'), args.eventId))
      .collect();
  },
});

export const updateInvitee = mutation({
  args: {
    eventId: v.id('events'),
    attendeeName: v.string(),
    attendeeEmailAddress: v.string(),
    attendeeCount: v.number(),
    attendeeComment: v.string(),
    attendeeStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const existingInvitee = await ctx.db
      .query('invitees')
      .filter((q) => q.eq(q.field('eventId'), args.eventId))
      .filter((q) => q.eq(q.field('email'), args.attendeeEmailAddress))
      .first();

    if (existingInvitee.length === 0) {
      return await ctx.db.patch(existingInvitee.id, {
        email: args.attendeeEmailAddress,
        name: args.attendeeName,
        count: args.attendeeCount,
        comment: args.attendeeComment,
        status: args.attendeeStatus,
      });
    }

    return await ctx.db.insert('invitees', {
      eventId: args.eventId,
      email: args.attendeeEmailAddress,
      name: args.attendeeName,
      count: args.attendeeCount,
      comment: args.attendeeComment,
      status: args.attendeeStatus,
    });
  },
});

export const deleteInvitee = mutation({
  args: {
    attendeeId: v.id('invitees'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.attendeeId);
  },
});

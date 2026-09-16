import { z } from 'zod';

export const ticketItemsSchema = z.object({
  items: z.array(z.object({ tierCode: z.string().trim().min(1), quantity: z.number().int().positive().max(20) })).min(1)
});

export const importSchema = z.object({ csvText: z.string().min(1).max(1_000_000) });

'use server';

import { unitConversionTool, UnitConversionToolInput } from '@/ai/flows/unit-conversion-tool';
import { z } from 'zod';

const inputSchema = z.object({
  conversionQuery: z.string().min(3, { message: "Query must be at least 3 characters." }),
});

export async function getUnitConversion(values: z.infer<typeof inputSchema>) {
  const validatedFields = inputSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid input.' };
  }
  
  const validatedInput: UnitConversionToolInput = {
    conversionQuery: validatedFields.data.conversionQuery,
  };
  
  try {
    const result = await unitConversionTool(validatedInput);
    return { success: true, data: result };
  } catch (error) {
    console.error('Unit conversion AI tool error:', error);
    return { success: false, error: 'Failed to get conversion from AI service.' };
  }
}

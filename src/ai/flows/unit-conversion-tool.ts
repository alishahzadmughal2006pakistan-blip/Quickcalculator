'use server';

/**
 * @fileOverview AI tool to perform common unit conversions using natural language.
 *
 * - unitConversionTool - A function that handles the unit conversion process.
 * - UnitConversionToolInput - The input type for the unitConversionTool function.
 * - UnitConversionToolOutput - The return type for the unitConversionTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnitConversionToolInputSchema = z.object({
  conversionQuery: z
    .string()
    .describe(
      'A natural language query specifying the unit conversion to perform, e.g., \'convert 100 USD to EUR\'.'
    ),
});
export type UnitConversionToolInput = z.infer<typeof UnitConversionToolInputSchema>;

const UnitConversionToolOutputSchema = z.object({
  result: z
    .string()
    .describe('The result of the unit conversion, including the converted value and units.'),
});
export type UnitConversionToolOutput = z.infer<typeof UnitConversionToolOutputSchema>;

export async function unitConversionTool(input: UnitConversionToolInput): Promise<UnitConversionToolOutput> {
  return unitConversionToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'unitConversionToolPrompt',
  input: {schema: UnitConversionToolInputSchema},
  output: {schema: UnitConversionToolOutputSchema},
  prompt: `You are a unit conversion tool.  The user will specify a conversion in natural language, and you will respond with the result of the conversion.  Be as accurate as possible.

Conversion Query: {{{conversionQuery}}}`,
});

const unitConversionToolFlow = ai.defineFlow(
  {
    name: 'unitConversionToolFlow',
    inputSchema: UnitConversionToolInputSchema,
    outputSchema: UnitConversionToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

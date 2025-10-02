'use server';
/**
 * @fileOverview Provides AI-powered tax calculation.
 *
 * - calculateTax - A function that returns tax information for a given income and country.
 * - TaxCalculationInput - The input type for the tax calculation flow.
 * - TaxCalculationOutput - The output type for the tax calculation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TaxCalculationInputSchema = z.object({
  income: z.number().describe('The income or amount to calculate tax on.'),
  country: z.string().describe('The two-letter country code (e.g., US, CA, GB).'),
  taxType: z.string().describe('The type of tax to calculate: "income" for income tax or "vat" for VAT/GST.'),
});
export type TaxCalculationInput = z.infer<typeof TaxCalculationInputSchema>;

const TaxCalculationOutputSchema = z.object({
  taxAmount: z.number().describe('The total calculated tax amount.'),
  effectiveRate: z.number().describe('The effective tax rate as a percentage.'),
});
export type TaxCalculationOutput = z.infer<typeof TaxCalculationOutputSchema>;

export async function calculateTax(input: TaxCalculationInput): Promise<TaxCalculationOutput> {
  return taxCalculatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taxCalculatorPrompt',
  input: { schema: TaxCalculationInputSchema },
  output: { schema: TaxCalculationOutputSchema },
  prompt: `You are an expert tax calculator. Your task is to calculate the total tax amount and the effective tax rate based on the user's input.
Use current, publicly available tax data for your calculations.

- If the taxType is "income", calculate the total federal/national income tax for the given gross annual income in the specified country.
- If the taxType is "vat", calculate the standard Value Added Tax (VAT) or Goods and Services Tax (GST) for the given amount in that country.

Do not include regional or state taxes, only the national level.
Provide the total tax amount and the effective tax rate.

Country Code: {{{country}}}
Tax Type: {{{taxType}}}
Amount: {{{income}}}

Return only the calculated numbers in the specified JSON format.`,
});

const taxCalculatorFlow = ai.defineFlow(
  {
    name: 'taxCalculatorFlow',
    inputSchema: TaxCalculationInputSchema,
    outputSchema: TaxCalculationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI could not calculate the tax. Please try again.');
    }
    return output;
  }
);

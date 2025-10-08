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

// Data for the tool - in a real app, this might come from a database or a more robust API.
const taxData: { [countryCode: string]: { income: any[], vat: number } } = {
  US: {
    income: [
      { from: 0, to: 11000, rate: 0.10 },
      { from: 11001, to: 44725, rate: 0.12 },
      { from: 44726, to: 95375, rate: 0.22 },
      { from: 95376, to: 182100, rate: 0.24 },
      { from: 182101, to: 231250, rate: 0.32 },
      { from: 231251, to: 578125, rate: 0.35 },
      { from: 578126, to: Infinity, rate: 0.37 },
    ],
    vat: 0, // US doesn't have a national VAT; sales tax varies by state.
  },
  CA: {
    income: [
      { from: 0, to: 53359, rate: 0.15 },
      { from: 53360, to: 106717, rate: 0.205 },
      { from: 106718, to: 165430, rate: 0.26 },
      { from: 165431, to: 235675, rate: 0.29 },
      { from: 235676, to: Infinity, rate: 0.33 },
    ],
    vat: 5, // GST
  },
  GB: {
    income: [
      { from: 0, to: 12570, rate: 0 },
      { from: 12571, to: 50270, rate: 0.20 },
      { from: 50271, to: 150000, rate: 0.40 },
      { from: 150001, to: Infinity, rate: 0.45 },
    ],
    vat: 20,
  },
  DE: {
    income: [
      { from: 0, to: 10908, rate: 0 },
      { from: 10909, to: 62809, rate: 0.14 }, // Progressive rate starts at 14%
      { from: 62810, to: 277825, rate: 0.42 },
      { from: 277826, to: Infinity, rate: 0.45 },
    ],
    vat: 19,
  },
  IN: {
    income: [ // Simplified for demonstration
      { from: 0, to: 300000, rate: 0 },
      { from: 300001, to: 600000, rate: 0.05 },
      { from: 600001, to: 900000, rate: 0.10 },
      { from: 900001, to: 1200000, rate: 0.15 },
      { from: 1200001, to: 1500000, rate: 0.20 },
      { from: 1500001, to: Infinity, rate: 0.30 },
    ],
    vat: 18, // Standard GST rate
  },
};

const getTaxRate = ai.defineTool(
    {
        name: 'getTaxRate',
        description: 'Get tax information for a given country.',
        inputSchema: z.object({
            country: z.string().describe('The two-letter country code (e.g., US, CA, GB).'),
            taxType: z.string().describe('The type of tax: "income" or "vat".'),
            income: z.number().optional().describe('The income, required if taxType is "income".'),
        }),
        outputSchema: z.object({
            taxAmount: z.number(),
        }),
    },
    async (input) => {
        const countryData = taxData[input.country];
        if (!countryData) {
            throw new Error(`Tax data not available for country: ${input.country}`);
        }

        if (input.taxType === 'vat') {
            const taxAmount = input.income! * (countryData.vat / 100);
            return { taxAmount };
        }

        if (input.taxType === 'income') {
            const income = input.income!;
            const brackets = countryData.income;
            let totalTax = 0;
            let remainingIncome = income;

            for (const bracket of brackets) {
                if (income > bracket.from) {
                    const taxableInBracket = Math.min(income, bracket.to) - bracket.from;
                    if (taxableInBracket > 0) {
                        totalTax += taxableInBracket * bracket.rate;
                    }
                }
            }
             // A simple progressive calculation for demonstration. A real-world scenario would be more complex.
            if (input.country === 'DE' && income > 10908) { // Simplified German progressive tax
                 const taxableIncome = income - 10908;
                 let rate = 0.14 + (0.28 * (taxableIncome / 51801));
                 rate = Math.min(rate, 0.42);
                 if (income > 277825) rate = 0.45;
                 totalTax = taxableIncome * rate;
            }


            return { taxAmount: totalTax };
        }

        throw new Error(`Invalid tax type: ${input.taxType}`);
    }
);


const prompt = ai.definePrompt({
  name: 'taxCalculatorPrompt',
  input: { schema: TaxCalculationInputSchema },
  output: { schema: TaxCalculationOutputSchema },
  tools: [getTaxRate],
  prompt: `You are an expert tax calculator. Your task is to calculate the total tax amount and the effective tax rate based on the user's input by using the provided tools.

- Use the getTaxRate tool to get the tax amount for the user's income, country, and tax type.
- After getting the tax amount, calculate the effective tax rate: (taxAmount / income) * 100.
- Return both the calculated tax amount and the effective tax rate.

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

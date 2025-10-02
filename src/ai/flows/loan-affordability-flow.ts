'use server';
/**
 * @fileOverview Provides AI-powered loan affordability suggestions.
 *
 * - generateLoanAffordabilitySuggestion - A function that returns a loan suggestion.
 * - LoanAffordabilityInput - The input type for the flow.
 * - LoanAffordabilityOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const LoanAffordabilityInputSchema = z.object({
  monthlyIncome: z.number().describe('The user\'s total monthly income before taxes.'),
  monthlyDebts: z.number().describe('The user\'s total monthly debt payments (e.g., rent, other loans, credit cards).'),
});
export type LoanAffordabilityInput = z.infer<typeof LoanAffordabilityInputSchema>;

const LoanAffordabilityOutputSchema = z.object({
  suggestion: z.string().describe('A helpful, non-binding suggestion about what loan amount might be reasonable for the user, presented as a friendly paragraph.'),
});
export type LoanAffordabilityOutput = z.infer<typeof LoanAffordabilityOutputSchema>;

export async function generateLoanAffordabilitySuggestion(input: LoanAffordabilityInput): Promise<LoanAffordabilityOutput> {
  return loanAffordabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'loanAffordabilityPrompt',
  input: { schema: LoanAffordabilityInputSchema },
  output: { schema: LoanAffordabilityOutputSchema },
  prompt: `You are a friendly and conservative financial assistant. Your task is to provide a helpful, non-binding suggestion about loan affordability.

A user has provided their monthly income and existing monthly debt payments.
- Calculate the user's debt-to-income (DTI) ratio: (monthlyDebts / monthlyIncome).
- Based on the DTI, estimate a reasonable *additional* monthly payment the user could afford for a new loan. A general rule is that total debt payments (existing + new) should not exceed 36-43% of income. Be conservative.
- Based on that affordable monthly payment, estimate a total loan amount they might consider. Assume a 5-year loan term and an 8% annual interest rate for this estimation.
- Formulate a friendly, single-paragraph suggestion. Start by mentioning their disposable income. Then, suggest a possible total loan amount.
- IMPORTANT: Frame this as a general suggestion, NOT as financial advice. Include a disclaimer that rates and terms vary.

User's Monthly Income: {{{monthlyIncome}}}
User's Monthly Debts: {{{monthlyDebts}}}

Example Output: "Based on your income and existing debts, you have a good amount of disposable income. A loan of around $15,000 might be manageable for you. This is just an estimate, as final loan amounts depend on interest rates, credit score, and loan terms offered by a lender."

Generate a suggestion for the user.`,
});

const loanAffordabilityFlow = ai.defineFlow(
  {
    name: 'loanAffordabilityFlow',
    inputSchema: LoanAffordabilityInputSchema,
    outputSchema: LoanAffordabilityOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI could not generate a suggestion. Please try again.');
    }
    return output;
  }
);

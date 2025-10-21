import { initializeApp } from 'firebase-admin/app';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import * as z from 'zod';

initializeApp();

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
});

// Define Schemas
const LoanAffordabilityInputSchema = z.object({
  monthlyIncome: z.number(),
  monthlyDebts: z.number(),
});

const LoanAffordabilityOutputSchema = z.object({
  suggestion: z.string(),
});

// Define and export the Genkit Flow
export const loanAffordabilityFlow = ai.defineFlow(
  {
    name: 'loanAffordabilityFlow',
    inputSchema: LoanAffordabilityInputSchema,
    outputSchema: LoanAffordabilityOutputSchema,
  },
  async (input) => {
    const prompt = `Based on a monthly income of $${input.monthlyIncome} and monthly debt payments of $${input.monthlyDebts}, provide a one-sentence suggestion about what size loan this person might be able to afford. Consider a debt-to-income ratio of around 36-43% as a common benchmark. Be encouraging and provide a general estimate (e.g., 'a small personal loan', 'a modest car loan', 'a significant mortgage').`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: prompt,
      output: {
        schema: LoanAffordabilityOutputSchema,
      },
    });

    return output!;
  }
);

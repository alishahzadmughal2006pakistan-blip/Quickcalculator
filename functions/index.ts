
'use server';
import { onCall } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import * as path from "path";
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import * as z from 'zod';

// This is required for Firebase to find the Next.js app
process.chdir(path.join(__dirname, ".."));

initializeApp();

// Initialize Genkit
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});

// Define Schemas
const LoanAffordabilityInputSchema = z.object({
  monthlyIncome: z.number(),
  monthlyDebts: z.number(),
});

const LoanAffordabilityOutputSchema = z.object({
  suggestion: z.string(),
});

// Define Genkit Flow
export const loanAffordabilityFlow = ai.defineFlow(
  {
    name: "loanAffordabilityFlow",
    inputSchema: LoanAffordabilityInputSchema,
    outputSchema: LoanAffordabilityOutputSchema,
  },
  async (input) => {
    const prompt = `Based on a monthly income of $${input.monthlyIncome} and monthly debt payments of $${input.monthlyDebts}, provide a one-sentence suggestion about what size loan this person might be able to afford. Consider a debt-to-income ratio of around 36-43% as a common benchmark. Be encouraging and provide a general estimate (e.g., 'a small personal loan', 'a modest car loan', 'a significant mortgage').`;

    const { output } = await ai.generate({
      model: "googleai/gemini-pro",
      prompt: prompt,
      output: {
        schema: LoanAffordabilityOutputSchema,
      },
    });

    return output!;
  }
);


// Define the Cloud Function trigger
export const loanAffordability = onCall(
  { region: "us-central1" },
  async (request) => {
    return await loanAffordabilityFlow(request.data);
  }
);

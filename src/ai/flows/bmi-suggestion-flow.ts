'use server';
/**
 * @fileOverview Provides AI-generated suggestions based on BMI.
 *
 * - generateBmiSuggestion - A function that returns a suggestion for a given BMI.
 * - BmiSuggestionInput - The input type for the suggestion flow.
 * - BmiSuggestionOutput - The output type for the suggestion flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BmiSuggestionInputSchema = z.object({
  bmi: z.number().describe('The user\'s Body Mass Index (BMI) value.'),
  category: z.string().describe('The user\'s BMI category (e.g., Underweight, Normal, Overweight, Obese).'),
});
export type BmiSuggestionInput = z.infer<typeof BmiSuggestionInputSchema>;

const BmiSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('A brief, helpful, non-medical suggestion for the user.'),
});
export type BmiSuggestionOutput = z.infer<typeof BmiSuggestionOutputSchema>;

export async function generateBmiSuggestion(input: BmiSuggestionInput): Promise<BmiSuggestionOutput> {
  return bmiSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bmiSuggestionPrompt',
  input: {schema: BmiSuggestionInputSchema},
  output: {schema: BmiSuggestionOutputSchema},
  prompt: `You are a helpful assistant in a calculator app.
A user has calculated their BMI. Your task is to provide a single, brief, positive, and encouraging suggestion based on their BMI category.
This is not medical advice. Do not mention doctors, diets, or intense exercise.
Focus on simple, healthy lifestyle habits.

BMI Value: {{{bmi}}}
BMI Category: {{{category}}}

Example for "Overweight": "Taking a short walk after meals can be a great way to support your health."
Example for "Normal": "Great job maintaining a healthy range! Staying active with activities you enjoy is a wonderful way to keep it up."
Example for "Underweight": "Ensuring you have balanced meals with enough protein can be beneficial."

Generate a suggestion for the user.`,
});

const bmiSuggestionFlow = ai.defineFlow(
  {
    name: 'bmiSuggestionFlow',
    inputSchema: BmiSuggestionInputSchema,
    outputSchema: BmiSuggestionOutputSchema,
  },
  async input => {
    if (input.category === '') {
        return { suggestion: '' };
    }
    const {output} = await prompt(input);
    return output!;
  }
);

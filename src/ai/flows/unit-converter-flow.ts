'use server';
/**
 * @fileOverview Provides AI-powered unit conversions from natural language.
 *
 * - convertUnitsWithAi - A function that takes a natural language query and returns a structured conversion.
 * - UnitConversionInput - The input type for the conversion flow.
 * - UnitConversionOutput - The output type for the conversion flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnitConversionInputSchema = z.object({
  query: z.string().describe('The natural language query for unit conversion (e.g., "convert 100km to miles").'),
});
export type UnitConversionInput = z.infer<typeof UnitConversionInputSchema>;

const UnitConversionOutputSchema = z.object({
  category: z.string().describe('The category of the conversion (e.g., Length, Weight, Volume, etc.).'),
  fromUnit: z.string().describe('The unit to convert from.'),
  toUnit: z.string().describe('The unit to convert to.'),
  fromValue: z.number().describe('The value to convert from.'),
  toValue: z.number().describe('The resulting converted value.'),
});
export type UnitConversionOutput = z.infer<typeof UnitConversionOutputSchema>;


export async function convertUnitsWithAi(input: UnitConversionInput): Promise<UnitConversionOutput> {
  return unitConverterFlow(input);
}

const units = {
  Length: {
    Meter: 1,
    Kilometer: 1000,
    Centimeter: 0.01,
    Millimeter: 0.001,
    Mile: 1609.34,
    Yard: 0.9144,
    Foot: 0.3048,
    Inch: 0.0254,
  },
  Weight: {
    Kilogram: 1,
    Gram: 0.001,
    Milligram: 0.000001,
    Pound: 0.453592,
    Ounce: 0.0283495,
  },
  Volume: {
    Liter: 1,
    Milliliter: 0.001,
    'Gallon (US)': 3.78541,
    'Quart (US)': 0.946353,
    'Pint (US)': 0.473176,
    'Cup (US)': 0.24,
  },
  Temperature: {
    Celsius: 'celsius',
    Fahrenheit: 'fahrenheit',
    Kelvin: 'kelvin',
  },
  Speed: {
    'm/s': 1,
    'km/h': 0.277778,
    'mph': 0.44704,
    'knot': 0.514444,
  },
};


const performConversion = (
  fromValue: number,
  fromUnit: string,
  toUnit: string,
  category: keyof typeof units
) => {
    let convertedValue;
    const currentUnits = units[category];

    if (category === 'Temperature') {
        const from = currentUnits[fromUnit as keyof typeof currentUnits];
        const to = currentUnits[toUnit as keyof typeof currentUnits];

        if (from === 'celsius') {
            if (to === 'fahrenheit') convertedValue = (fromValue * 9/5) + 32;
            else if (to === 'kelvin') convertedValue = fromValue + 273.15;
            else convertedValue = fromValue;
        } else if (from === 'fahrenheit') {
            if (to === 'celsius') convertedValue = (fromValue - 32) * 5/9;
            else if (to === 'kelvin') convertedValue = ((fromValue - 32) * 5/9) + 273.15;
            else convertedValue = fromValue;
        } else if (from === 'kelvin') {
            if (to === 'celsius') convertedValue = fromValue - 273.15;
            else if (to === 'fahrenheit') convertedValue = ((fromValue - 273.15) * 9/5) + 32;
            else convertedValue = fromValue;
        } else {
            convertedValue = fromValue; // same unit
        }
    } else {
        const fromFactor = currentUnits[fromUnit as keyof typeof currentUnits] as number;
        const toFactor = currentUnits[toUnit as keyof typeof currentUnits] as number;
        const valueInBase = fromValue * fromFactor;
        convertedValue = valueInBase / toFactor;
    }
    return convertedValue ?? fromValue;
};


const unitIdentificationPrompt = ai.definePrompt({
    name: 'unitIdentificationPrompt',
    input: { schema: z.object({ query: z.string(), unitList: z.any() }) },
    output: { schema: z.object({
        category: z.string().describe('The category of the conversion.'),
        fromUnit: z.string().describe('The unit to convert from.'),
        toUnit: z.string().describe('The unit to convert to.'),
        fromValue: z.number().describe('The value to convert from.'),
    }) },
    prompt: `You are a unit conversion expert. Your task is to identify the units, value, and category from the user's query.

User Query: {{{query}}}

Available Units by Category:
{{{unitList}}}

Extract the category, fromUnit, toUnit, and fromValue from the query. The unit names must exactly match one of the keys in the provided unit list.`,
});


const unitConverterFlow = ai.defineFlow(
  {
    name: 'unitConverterFlow',
    inputSchema: UnitConversionInputSchema,
    outputSchema: UnitConversionOutputSchema,
  },
  async (input) => {
    const { output } = await unitIdentificationPrompt({ 
        query: input.query, 
        unitList: JSON.stringify(units, null, 2),
    });

    if (!output) {
      throw new Error("Could not identify units from the query.");
    }
    
    const { category, fromUnit, toUnit, fromValue } = output;

    const typedCategory = category as keyof typeof units;

    if (!units[typedCategory]) {
        throw new Error(`Invalid category: ${category}`);
    }

    const toValue = performConversion(fromValue, fromUnit, toUnit, typedCategory);

    return {
      category,
      fromUnit,
      toUnit,
      fromValue,
      toValue,
    };
  }
);

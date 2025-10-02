
'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Loader, Wand2 } from 'lucide-react';
import { convertUnitsWithAi } from '@/ai/flows/unit-converter-flow';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

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

type UnitCategory = keyof typeof units;

const UnitConverter = () => {
  const [category, setCategory] = useState<UnitCategory>('Length');
  const [fromUnit, setFromUnit] = useState(Object.keys(units.Length)[0]);
  const [toUnit, setToUnit] = useState(Object.keys(units.Length)[1]);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const convert = useCallback(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || !value) {
      setResult(null);
      return;
    }

    const currentUnits = units[category];
    let convertedValue;

    if (category === 'Temperature') {
        const from = currentUnits[fromUnit as keyof typeof currentUnits];
        const to = currentUnits[toUnit as keyof typeof currentUnits];
        if (from === 'celsius') {
            if (to === 'fahrenheit') convertedValue = (numValue * 9/5) + 32;
            else if (to === 'kelvin') convertedValue = numValue + 273.15;
            else convertedValue = numValue;
        } else if (from === 'fahrenheit') {
            if (to === 'celsius') convertedValue = (numValue - 32) * 5/9;
            else if (to === 'kelvin') convertedValue = ((numValue - 32) * 5/9) + 273.15;
            else convertedValue = numValue;
        } else if (from === 'kelvin') {
            if (to === 'celsius') convertedValue = numValue - 273.15;
            else if (to === 'fahrenheit') convertedValue = ((numValue - 273.15) * 9/5) + 32;
            else convertedValue = numValue;
        } else {
             convertedValue = numValue;
        }
    } else {
        const fromFactor = currentUnits[fromUnit as keyof typeof currentUnits] as number;
        const toFactor = currentUnits[toUnit as keyof typeof currentUnits] as number;
        const valueInBase = numValue * fromFactor;
        convertedValue = valueInBase / toFactor;
    }
    
    setResult(convertedValue?.toFixed(5) ?? null);
  }, [value, fromUnit, toUnit, category]);

  useEffect(() => {
    const unitKeys = Object.keys(units[category]);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys.length > 1 ? unitKeys[1] : unitKeys[0]);
    setValue('');
    setResult(null);
  }, [category]);
  
  useEffect(() => {
    convert();
  }, [convert]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleAiConvert = () => {
    if (!aiQuery) return;
    setAiResult(null);

    startTransition(async () => {
      try {
        const result = await convertUnitsWithAi({ query: aiQuery });
        setAiResult(`${result.fromValue} ${result.fromUnit} = ${result.toValue.toFixed(5)} ${result.toUnit}`);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "AI Conversion Failed",
          description: "Couldn't understand the conversion. Please try rephrasing your request.",
        });
      }
    });
  };

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Unit Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <div className='space-y-2'>
                <Label htmlFor='ai-query'>Ask AI to Convert</Label>
                <div className="flex gap-2">
                    <Input 
                        id="ai-query" 
                        placeholder='e.g. "2 miles to km"' 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiConvert()}
                    />
                    <Button onClick={handleAiConvert} disabled={isPending} className="bg-purple-600 hover:bg-purple-700">
                        {isPending ? <Loader className="animate-spin" /> : <Wand2 />}
                    </Button>
                </div>
            </div>

            {aiResult && (
                 <div className="text-center space-y-2 pt-4">
                    <p className="text-muted-foreground">AI Result</p>
                    <p className="text-2xl font-bold text-purple-600 break-all">
                    {aiResult}
                    </p>
                </div>
            )}
        </div>

        <Separator />

        <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as UnitCategory)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(units).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Value</Label>
            <Input type="number" placeholder="0" value={value} onChange={(e) => setValue(e.target.value)} className="text-lg" />
        </div>
      
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="fromUnit">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger id="fromUnit" className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(units[category]).map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" className="mt-8" onClick={handleSwap}>
            <ArrowRightLeft className="h-5 w-5"/>
          </Button>
          <div className="flex-1 space-y-2">
            <Label htmlFor="toUnit">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger id="toUnit" className="w-full">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(units[category]).map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="border-t border-border pt-4 mt-4 text-center space-y-2">
            <p className="text-muted-foreground">Result</p>
            <p className="text-3xl font-bold text-primary break-all">
              {result}
            </p>
             <p className="text-sm text-muted-foreground">{`${value} ${fromUnit} = ${result} ${toUnit}`}</p>
          </div>
        )}
        
        <Button onClick={convert} className="w-full h-12 text-lg font-bold bg-[#1ABC9C] hover:bg-[#1ABC9C]/90 text-white">
            Convert
        </Button>
      </CardContent>
    </Card>
  );
};

export default UnitConverter;

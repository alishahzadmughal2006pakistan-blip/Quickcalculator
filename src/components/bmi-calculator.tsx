'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { generateBmiSuggestion } from '@/ai/flows/bmi-suggestion-flow';
import { Loader } from 'lucide-react';

const BmiCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isPending, startTransition] = useTransition();

  const calculateBmi = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      setBmi(null);
      setBmiCategory('');
      setCategoryColor('');
      setSuggestion('');
      return;
    }

    const weightInKg = weightUnit === 'lb' ? weightNum * 0.453592 : weightNum;
    const heightInM = heightUnit === 'in' ? heightNum * 0.0254 : heightNum / 100;
    
    if (heightInM === 0) return;

    const bmiValue = weightInKg / (heightInM * heightInM);
    setBmi(bmiValue);

    let category = '';
    let color = '';

    if (bmiValue < 18.5) {
      category = 'Underweight';
      color = 'text-yellow-500';
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      category = 'Normal';
      color = 'text-green-500';
    } else if (bmiValue >= 25 && bmiValue < 30) {
      category = 'Overweight';
      color = 'text-yellow-500';
    } else {
      category = 'Obese';
      color = 'text-red-500';
    }
    setBmiCategory(category);
    setCategoryColor(color);

    startTransition(async () => {
        try {
            const result = await generateBmiSuggestion({ bmi: bmiValue, category: category });
            setSuggestion(result.suggestion);
        } catch (e) {
            console.error(e);
            setSuggestion('Could not generate a suggestion at this time.');
        }
    });
  };

  useEffect(() => {
    // This effect will run when the user stops typing for 500ms
    const handler = setTimeout(() => {
        if(weight && height) {
            calculateBmi();
        }
    }, 500);

    return () => {
        clearTimeout(handler);
    };
  }, [weight, height, weightUnit, heightUnit]);

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">BMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input id="weight" type="number" placeholder="0" value={weight} onChange={(e) => setWeight(e.target.value)} className="text-lg" />
            <ToggleGroup type="single" value={weightUnit} onValueChange={(value) => { if (value) setWeightUnit(value); }} className="w-full">
              <ToggleGroupItem value="kg" className="w-1/2">kg</ToggleGroupItem>
              <ToggleGroupItem value="lb" className="w-1/2">lb</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input id="height" type="number" placeholder="0" value={height} onChange={(e) => setHeight(e.target.value)} className="text-lg" />
            <ToggleGroup type="single" value={heightUnit} onValueChange={(value) => { if (value) setHeightUnit(value); }} className="w-full">
              <ToggleGroupItem value="cm" className="w-1/2">cm</ToggleGroupItem>
              <ToggleGroupItem value="in" className="w-1/2">in</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {bmi !== null && (
          <div className="border-t border-border pt-4 mt-4 text-center space-y-2">
            <p className="text-muted-foreground">Your BMI is</p>
            <p className={cn("text-5xl font-bold", categoryColor)}>
              {bmi.toFixed(1)}
            </p>
            <p className={cn("font-semibold", categoryColor)}>
              {bmiCategory}
            </p>
            <div className="text-sm text-muted-foreground min-h-[40px] flex items-center justify-center px-4">
              {isPending ? <Loader className="animate-spin" /> : <p>{suggestion}</p>}
            </div>
          </div>
        )}
        
        <Button onClick={calculateBmi} className="w-full h-12 text-lg font-bold">
            Calculate
        </Button>
      </CardContent>
    </Card>
  );
};

export default BmiCalculator;

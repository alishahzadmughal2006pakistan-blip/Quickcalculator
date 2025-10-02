'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const PercentageCalculator = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [operation, setOperation] = useState('');

  const calculatePercentage = (op: string) => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);
    setOperation(op);

    if (isNaN(num1) || isNaN(num2)) {
      setResult('Invalid input');
      return;
    }

    let calculatedResult: number;
    switch (op) {
      case '% of':
        calculatedResult = (num1 / 100) * num2;
        setResult(`${num1}% of ${num2} is ${calculatedResult.toLocaleString()}`);
        break;
      case 'Increase by %':
        calculatedResult = num1 + (num1 * (num2 / 100));
        setResult(`${num1} increased by ${num2}% is ${calculatedResult.toLocaleString()}`);
        break;
      case 'Decrease by %':
        calculatedResult = num1 - (num1 * (num2 / 100));
        setResult(`${num1} decreased by ${num2}% is ${calculatedResult.toLocaleString()}`);
        break;
      default:
        setResult('Select an operation');
    }
  };

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Percentage Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value1">Value 1</Label>
            <Input id="value1" type="number" placeholder="0" value={value1} onChange={(e) => setValue1(e.target.value)} className="text-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value2">Value 2</Label>
            <Input id="value2" type="number" placeholder="0" value={value2} onChange={(e) => setValue2(e.target.value)} className="text-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button onClick={() => calculatePercentage('% of')} style={{ backgroundColor: '#F39C12' }} className="text-white">What is % of</Button>
          <Button onClick={() => calculatePercentage('Increase by %')} style={{ backgroundColor: '#F39C12' }} className="text-white">Increase by %</Button>
          <Button onClick={() => calculatePercentage('Decrease by %')} style={{ backgroundColor: '#F39C12' }} className="text-white">Decrease by %</Button>
        </div>

        {result && (
          <div className="border-t border-border pt-4 mt-4 text-center space-y-2">
            <p className="text-muted-foreground">Result</p>
            <p className="text-2xl font-bold text-primary">
              {result}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PercentageCalculator;

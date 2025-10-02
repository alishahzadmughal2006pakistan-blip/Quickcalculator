'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PercentageCalculator = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [operation, setOperation] = useState('percentOf');

  const calculatePercentage = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    if (isNaN(num1) || isNaN(num2)) {
      setResult(null);
      return;
    }

    let calculatedResult: number;
    let resultString = '';

    switch (operation) {
      case 'percentOf':
        calculatedResult = (num1 / 100) * num2;
        resultString = `${num1}% of ${num2} is ${calculatedResult.toLocaleString()}`;
        break;
      case 'isWhatPercentOf':
        if (num2 === 0) {
            resultString = 'Cannot divide by zero';
        } else {
            calculatedResult = (num1 / num2) * 100;
            resultString = `${num1} is ${calculatedResult.toFixed(2)}% of ${num2}`;
        }
        break;
      case 'increase':
        calculatedResult = num1 + (num1 * (num2 / 100));
        resultString = `${num1} increased by ${num2}% is ${calculatedResult.toLocaleString()}`;
        break;
      case 'decrease':
        calculatedResult = num1 - (num1 * (num2 / 100));
        resultString = `${num1} decreased by ${num2}% is ${calculatedResult.toLocaleString()}`;
        break;
      default:
        resultString = 'Select an operation';
    }
    setResult(resultString);
  };
  
  useEffect(() => {
    // Recalculate on input change if both values are present
    if (value1 && value2) {
      calculatePercentage();
    } else {
      setResult(null);
    }
  }, [value1, value2, operation]);

  const getLabels = () => {
    switch (operation) {
        case 'percentOf':
            return {label1: 'Percentage (%)', label2: 'Value'};
        case 'isWhatPercentOf':
            return {label1: 'Value 1', label2: 'Value 2'};
        case 'increase':
            return {label1: 'Original Value', label2: 'Increase by %'};
        case 'decrease':
            return {label1: 'Original Value', label2: 'Decrease by %'};
        default:
            return {label1: 'Value 1', label2: 'Value 2'};
    }
  }

  const {label1, label2} = getLabels();


  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Percentage Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Operation</Label>
            <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an operation" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="percentOf">% of a number</SelectItem>
                    <SelectItem value="isWhatPercentOf">X is what % of Y</SelectItem>
                    <SelectItem value="increase">Increase by %</SelectItem>
                    <SelectItem value="decrease">Decrease by %</SelectItem>
                </SelectContent>
            </Select>
        </div>
      
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value1">{label1}</Label>
            <Input id="value1" type="number" placeholder="0" value={value1} onChange={(e) => setValue1(e.target.value)} className="text-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value2">{label2}</Label>
            <Input id="value2" type="number" placeholder="0" value={value2} onChange={(e) => setValue2(e.target.value)} className="text-lg" />
          </div>
        </div>

        {result && (
          <div className="border-t border-border pt-4 mt-4 text-center space-y-2">
            <p className="text-muted-foreground">Result</p>
            <p className="text-2xl font-bold text-primary">
              {result}
            </p>
          </div>
        )}
        
        <Button onClick={calculatePercentage} className="w-full h-12 text-lg font-bold text-white" style={{ backgroundColor: '#F39C12' }}>
            Calculate
        </Button>
      </CardContent>
    </Card>
  );
};

export default PercentageCalculator;

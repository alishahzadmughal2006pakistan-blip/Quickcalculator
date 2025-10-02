'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Divide, Minus, Plus, X, Percent, PlusMinus } from 'lucide-react';

type CalculatorProps = {
  addToHistory: (calculation: string) => void;
};

const Calculator = ({ addToHistory }: CalculatorProps) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const performCalculation = {
    '/': (first: number, second: number) => first / second,
    '*': (first: number, second: number) => first * second,
    '+': (first: number, second: number) => first + second,
    '-': (first: number, second: number) => first - second,
    'xʸ': (first: number, second: number) => Math.pow(first, second),
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation[operator as keyof typeof performCalculation](firstOperand, inputValue);
      const calculationString = `${firstOperand} ${operator === '*' ? '×' : operator} ${inputValue} = ${result}`;
      addToHistory(calculationString);
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const resetCalculator = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      const inputValue = parseFloat(displayValue);
      const result = performCalculation[operator as keyof typeof performCalculation](firstOperand, inputValue);
      const calculationString = `${firstOperand} ${operator === '*' ? '×' : operator} ${inputValue} = ${result}`;
      addToHistory(calculationString);
      setDisplayValue(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(true); // Ready for new calculation
    }
  };
  
  const handleUnaryOperator = (op: string) => {
    const inputValue = parseFloat(displayValue);
    let result = inputValue;
    let calculationString = '';

    switch(op) {
        case '±':
            result = inputValue * -1;
            break;
        case '%':
            result = inputValue / 100;
            calculationString = `${inputValue}% = ${result}`;
            break;
        case '√':
            result = Math.sqrt(inputValue);
            calculationString = `√(${inputValue}) = ${result}`;
            break;
        case 'log':
            result = Math.log10(inputValue);
            calculationString = `log(${inputValue}) = ${result}`;
            break;
    }
    
    if (calculationString) {
        addToHistory(calculationString);
    }
    setDisplayValue(String(result));
  }

  const renderButton = (key: string) => {
    const isNumber = !isNaN(parseInt(key)) || key === '.';
    const isOperator = ['/', '*', '-', '+', 'xʸ'].includes(key);
    const isEquals = key === '=';
    const isAC = key === 'AC';
    
    let variant: 'default' | 'secondary' | 'outline' = 'secondary';
    if(isOperator) variant = 'outline';
    if(isEquals) variant = 'default';

    const iconMap: { [key: string]: React.ReactNode } = {
        '/': <Divide />,
        '*': <X />,
        '-': <Minus />,
        '+': <Plus />,
        '%': <Percent />,
        '±': <PlusMinus />,
    };

    return (
        <Button
          key={key}
          variant={variant}
          size="lg"
          className={`h-16 text-2xl transition-transform active:scale-95 ${isEquals ? 'col-span-2' : ''} ${isAC ? 'text-destructive hover:text-destructive' : ''}`}
          onClick={() => {
            if (isNumber) {
              if (key === '.') inputDecimal();
              else inputDigit(key);
            } else if (isOperator) {
              handleOperator(key);
            } else if (isEquals) {
              handleEquals();
            } else if (isAC) {
              resetCalculator();
            } else {
              handleUnaryOperator(key);
            }
          }}
        >
          {iconMap[key] || key}
        </Button>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted text-right rounded-lg p-4 break-all">
        <p className="text-5xl font-code text-foreground">{displayValue}</p>
      </div>

      <div className="flex justify-end items-center gap-2">
        <Label htmlFor="advanced-mode" className="text-sm">Advanced</Label>
        <Switch id="advanced-mode" checked={advancedMode} onCheckedChange={setAdvancedMode}/>
      </div>

      {advancedMode && (
        <div className="grid grid-cols-4 gap-2">
            {['xʸ', 'log', '√', '%'].map(key => renderButton(key))}
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {renderButton('AC')}
        {renderButton('±')}
        {renderButton('/')}
        {['7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0'].map(key => renderButton(key))}
        {renderButton('.')}
        {renderButton('=')}
      </div>
    </div>
  );
};

export default Calculator;

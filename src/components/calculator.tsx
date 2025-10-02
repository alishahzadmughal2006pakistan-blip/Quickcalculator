'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Divide, Minus, Plus, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type CalculatorProps = {
  addToHistory: (calculation: string) => void;
  history: string[];
};

const BasicCalculator = ({ addToHistory, history }: CalculatorProps) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

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

  const performCalculation: { [key: string]: (a: number, b: number) => number } = {
    '/': (first, second) => first / second,
    '*': (first, second) => first * second,
    '+': (first, second) => first + second,
    '-': (first, second) => first - second,
    '^': (first, second) => Math.pow(first, second),
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
      try {
        const result = performCalculation[operator](firstOperand, inputValue);
        if(!isFinite(result)) throw new Error("Calculation error");
        const calculationString = `${firstOperand} ${operator === '*' ? '×' : operator} ${inputValue} = ${result}`;
        addToHistory(calculationString);
        setDisplayValue(String(result));
        setFirstOperand(result);
      } catch (error) {
        setDisplayValue("Error");
        setFirstOperand(null);
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const handleUnaryOperation = (operation: string) => {
    const inputValue = parseFloat(displayValue);
    let result: number;
    let calculationString = '';

    try {
        if (operation === '√') {
            if (inputValue < 0) throw new Error("Invalid input for square root");
            result = Math.sqrt(inputValue);
            calculationString = `√(${inputValue}) = ${result}`;
        } else if (operation === 'x²') {
            result = Math.pow(inputValue, 2);
            calculationString = `(${inputValue})² = ${result}`;
        } else if (operation === 'log') {
            if(inputValue <= 0) throw new Error("Invalid input for log");
            result = Math.log10(inputValue);
            calculationString = `log(${inputValue}) = ${result}`;
        } else {
            throw new Error("Unknown operation");
        }

        if(!isFinite(result)) throw new Error("Calculation error");
        addToHistory(calculationString);
        setDisplayValue(String(result));
        setFirstOperand(result);
        setWaitingForSecondOperand(true);

    } catch (e: any) {
        setDisplayValue("Error");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    }
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
       try {
        const result = performCalculation[operator](firstOperand, inputValue);
        if(!isFinite(result)) throw new Error("Calculation error");
        const calculationString = `${firstOperand} ${operator === '*' ? '×' : operator} ${inputValue} = ${result}`;
        addToHistory(calculationString);
        setDisplayValue(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
      } catch (error) {
        setDisplayValue("Error");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
      }
    }
  };

  const toggleSign = () => {
    setDisplayValue(String(parseFloat(displayValue) * -1));
  };
  
  const renderButton = (key: string, className? : string, customClick?: () => void) => {
    const isNumber = !isNaN(parseInt(key)) || key === '.';
    const isBinaryOperator = ['/', '*', '-', '+', '^'].includes(key);
    const isUnaryOperator = ['√', 'x²', 'log'].includes(key);
    const isEquals = key === '=';
    const isClear = key === 'C';
    
    let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'secondary';
    if(isBinaryOperator || isEquals) variant = 'default';
    if(isClear || key === '+/-' || key === '%' || isUnaryOperator) variant = 'outline';

    const iconMap: { [key: string]: React.ReactNode } = {
        '/': <Divide size={24} />,
        '*': <X size={24} />,
        '-': <Minus size={24} />,
        '+': <Plus size={24} />,
    };
    
    let finalClassName = `h-14 sm:h-16 text-xl sm:text-2xl transition-transform active:scale-95 rounded-xl sm:rounded-full ${className}`;

    return (
        <Button
          key={key}
          variant={variant}
          size="lg"
          className={finalClassName}
          onClick={() => {
            if(customClick) {
              customClick();
              return;
            }
            if (displayValue === "Error") {
              resetCalculator();
              if(!isClear) {
                 if (key === '.') inputDecimal();
                 else inputDigit(key);
              }
              return;
            }
            if (isNumber) {
              if (key === '.') inputDecimal();
              else inputDigit(key);
            } else if (isBinaryOperator) {
              handleOperator(key);
            } else if (isUnaryOperator) {
              handleUnaryOperation(key);
            } else if (isEquals) {
              handleEquals();
            } else if (isClear) {
              resetCalculator();
            }
          }}
        >
          {iconMap[key] || key}
        </Button>
    )
  }

  return (
    <Card className="w-full shadow-lg rounded-2xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Basic Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="bg-muted text-right rounded-lg p-4 break-all">
            <ScrollArea className="h-16 sm:h-20 mb-2">
                <div className="flex flex-col items-end gap-1 pr-2">
                  {history.slice(0, 5).reverse().map((item, index) => (
                    <p key={index} className={`text-muted-foreground text-xs sm:text-sm ${index === 4 ? 'font-bold' : ''}`}>
                      {item}
                    </p>
                  ))}
                </div>
            </ScrollArea>
            <p className="text-4xl sm:text-6xl font-light text-foreground">{displayValue}</p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {renderButton('√')}
            {renderButton('x²')}
            {renderButton('^')}
            {renderButton('log')}
            {renderButton('C')}
            
            {renderButton('7')}
            {renderButton('8')}
            {renderButton('9')}
            {renderButton('+/-', '', toggleSign)}
            {renderButton('/')}

            {renderButton('4')}
            {renderButton('5')}
            {renderButton('6')}
            {renderButton('%', '', () => setDisplayValue(String(parseFloat(displayValue) / 100)))}
            {renderButton('*')}

            {renderButton('1')}
            {renderButton('2')}
            {renderButton('3')}
            {renderButton('=', 'col-start-4 row-start-4 row-span-2 h-auto')}
            {renderButton('-')}
            
            {renderButton('0', 'col-span-2')}
            {renderButton('.')}
            {renderButton('+')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicCalculator;

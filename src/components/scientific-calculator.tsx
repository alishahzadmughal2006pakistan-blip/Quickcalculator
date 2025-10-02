'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Divide, Minus, Plus, X } from 'lucide-react';
import { evaluateExpression } from '@/lib/math-eval';

const ScientificCalculator = () => {
  const [expression, setExpression] = useState('0');
  const [displayValue, setDisplayValue] = useState('0');
  const [hasCalculated, setHasCalculated] = useState(false);

  const inputDigit = (digit: string) => {
    if (hasCalculated) {
      setExpression(digit);
      setDisplayValue(digit);
      setHasCalculated(false);
    } else {
      const newExpression = expression === '0' ? digit : expression + digit;
      setExpression(newExpression);
      setDisplayValue(newExpression);
    }
  };
  
  const inputDecimal = () => {
    const segments = expression.split(/([+\-*/^()])/);
    const lastSegment = segments[segments.length - 1];
    if (!lastSegment.includes('.')) {
      const newExpression = expression + '.';
      setExpression(newExpression);
      setDisplayValue(newExpression);
    }
  };

  const handleOperator = (operator: string) => {
    setHasCalculated(false);
    const newExpression = `${expression} ${operator} `;
    setExpression(newExpression);
    setDisplayValue(newExpression);
  };
  
  const handleFunction = (func: string) => {
    if (hasCalculated) {
      setExpression(`${func}(`);
      setDisplayValue(`${func}(`);
      setHasCalculated(false);
    } else {
       const newExpression = expression === '0' ? `${func}(` : expression + `${func}(`;
       setExpression(newExpression);
       setDisplayValue(newExpression);
    }
  }

  const handleParenthesis = (paren: string) => {
    if (hasCalculated) {
        setExpression(paren);
        setDisplayValue(paren);
        setHasCalculated(false);
    } else {
        const newExpression = expression === '0' ? paren : expression + paren;
        setExpression(newExpression);
        setDisplayValue(newExpression);
    }
  };
  
  const handleEquals = () => {
    try {
        const result = evaluateExpression(expression);
        if(!isFinite(result)) throw new Error("Calculation error");
        setDisplayValue(String(result));
        setExpression(String(result));
        setHasCalculated(true);
    } catch {
        setDisplayValue('Error');
        setExpression('0');
        setHasCalculated(true);
    }
  };
  
  const resetCalculator = () => {
    setExpression('0');
    setDisplayValue('0');
    setHasCalculated(false);
  };

  const handleFactorial = () => {
      setHasCalculated(false);
      const newExpression = `fact(${expression})`;
      setExpression(newExpression);
      setDisplayValue(newExpression);
  }

  const renderButton = (key: string, className? : string, customClick?: () => void, customStyle?: React.CSSProperties) => {
    const isNumber = !isNaN(parseInt(key));
    const isDecimal = key === '.';
    const isOperator = ['/', '*', '-', '+', '^'].includes(key);
    const isFunction = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(key);
    const isFactorial = key === '!';
    const isParenthesis = ['(', ')'].includes(key);
    const isEquals = key === '=';
    const isClear = key === 'C';

    let variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' = 'secondary';
    if (isOperator || isEquals) variant = 'default';
    if (isClear || isFunction || isParenthesis || isFactorial) variant = 'outline';


    const iconMap: { [key:string]: React.ReactNode } = {
        '/': <Divide size={20} />,
        '*': <X size={20} />,
        '-': <Minus size={20} />,
        '+': <Plus size={20} />,
        'sqrt': '√',
    };

    return (
        <Button
          key={key}
          variant={variant}
          className={`h-12 text-lg transition-transform active:scale-95 rounded-xl ${className}`}
          style={customStyle}
          onClick={() => {
            if (displayValue === "Error" && !isClear) {
              resetCalculator();
              return;
            }
            if (customClick) {
                customClick();
            } else if (isNumber) {
                inputDigit(key);
            } else if (isDecimal) {
                inputDecimal();
            } else if (isOperator) {
                handleOperator(key);
            } else if (isFunction) {
                handleFunction(key);
            } else if (isFactorial) {
                handleFactorial();
            } else if (isParenthesis) {
                handleParenthesis(key);
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
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Scientific Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScrollArea className="h-20 bg-muted text-right rounded-lg p-3 break-all">
          <p className="text-3xl font-light text-foreground">{displayValue}</p>
        </ScrollArea>
        <div className="grid grid-cols-5 gap-2">
            {renderButton('sin')}
            {renderButton('cos')}
            {renderButton('tan')}
            {renderButton('log')}
            {renderButton('ln')}
            
            {renderButton('(')}
            {renderButton(')')}
            {renderButton('^')}
            {renderButton('sqrt')}
            {renderButton('!')}

            {renderButton('C', 'col-span-2', resetCalculator)}
            {renderButton('7')}
            {renderButton('8')}
            {renderButton('9')}
            {renderButton('/')}
            
            {renderButton('4')}
            {renderButton('5')}
            {renderButton('6')}
            {renderButton('*')}
            
            {renderButton('1')}
            {renderButton('2')}
            {renderButton('3')}
            {renderButton('-')}

            {renderButton('0', 'col-span-2')}
            {renderButton('.')}
            {renderButton('=', '', handleEquals, { backgroundColor: '#34495E', color: 'white' })}
            {renderButton('+', '', () => handleOperator('+'))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScientificCalculator;

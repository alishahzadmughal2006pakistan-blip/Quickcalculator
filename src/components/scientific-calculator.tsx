'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Divide, Minus, Plus, X } from 'lucide-react';

const ScientificCalculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  
  // Dummy functions for now
  const inputDigit = (digit: string) => {
    setDisplayValue(prev => (prev === '0' ? digit : prev + digit));
  };

  const handleOperator = (operator: string) => {
    setDisplayValue(prev => prev + ` ${operator} `);
  };
  
  const handleEquals = () => {
    // In a real scenario, you'd parse and compute the expression
    try {
        // WARNING: eval is unsafe and used for placeholder purposes only
        const result = eval(displayValue.replace('^', '**'));
        setDisplayValue(String(result));
    } catch {
        setDisplayValue('Error');
    }
  };
  
  const resetCalculator = () => {
    setDisplayValue('0');
  };

  const renderButton = (key: string, className? : string, customClick?: () => void) => {
    const isNumber = !isNaN(parseInt(key)) || key === '.';
    
    let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'secondary';
    if (['/', '*', '-', '+', '^'].includes(key) || key === '=') variant = 'default';
    if (['C', 'sin', 'cos', 'tan', 'log', 'ln', '√', '!', '(', ')'].includes(key)) variant = 'outline';

    const iconMap: { [key:string]: React.ReactNode } = {
        '/': <Divide size={20} />,
        '*': <X size={20} />,
        '-': <Minus size={20} />,
        '+': <Plus size={20} />,
    };

    return (
        <Button
          key={key}
          variant={variant}
          className={`h-12 text-lg transition-transform active:scale-95 rounded-xl ${className}`}
          onClick={() => {
            if (customClick) {
                customClick();
            } else if (isNumber) {
                inputDigit(key);
            } else if (key === '=') {
                handleEquals();
            } else if (key === 'C') {
                resetCalculator();
            } else {
                handleOperator(key);
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
            {renderButton('√')}
            {renderButton('!')}

            {renderButton('C')}
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
            {renderButton('=')}
            {renderButton('+')}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScientificCalculator;

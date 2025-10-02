'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Divide, Minus, Plus, Share2, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { evaluateExpression } from '@/lib/math-eval';
import { useSound } from '@/hooks/use-sound';

type CalculatorProps = {
  addToHistory: (calculation: string) => void;
  history?: string[];
};

const BasicCalculator = ({ addToHistory, history = [] }: CalculatorProps) => {
  const [expression, setExpression] = useState('0');
  const [displayValue, setDisplayValue] = useState('0');
  const [lastCalculation, setLastCalculation] = useState<string | null>(null);
  const { toast } = useToast();
  const [hasCalculated, setHasCalculated] = useState(false);
  const playClickSound = useSound('/sounds/click.mp3');

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
    // To prevent adding multiple decimals in the same number
    const segments = expression.split(/([+\-*/^()])/);
    const lastSegment = segments[segments.length - 1];
    if (!lastSegment.includes('.')) {
      const newExpression = expression + '.';
      setExpression(newExpression);
      setDisplayValue(newExpression);
    }
  };

  const handleOperator = (op: string) => {
    setHasCalculated(false);
    // Add space around binary operators for parsing, but not for unary minus.
    const newExpression = `${expression} ${op} `;
    setExpression(newExpression);
    setDisplayValue(newExpression);
  };
  
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

  const handleUnaryOperation = (op: string) => {
     if (hasCalculated) {
      setExpression(`${op}(`);
      setDisplayValue(`${op}(`);
      setHasCalculated(false);
    } else {
       const newExpression = expression === '0' ? `${op}(` : expression + `${op}(`;
       setExpression(newExpression);
       setDisplayValue(newExpression);
    }
  }

  const resetCalculator = () => {
    setExpression('0');
    setDisplayValue('0');
    setLastCalculation(null);
    setHasCalculated(false);
  };

  const handleEquals = () => {
    try {
      const result = evaluateExpression(expression);
      if (!isFinite(result)) throw new Error("Calculation error");
      
      const calculationString = `${expression} = ${result}`;
      addToHistory(calculationString);
      setLastCalculation(calculationString);
      
      setDisplayValue(String(result));
      setExpression(String(result));
      setHasCalculated(true);

    } catch (error) {
      setDisplayValue("Error");
      setExpression("0");
      setHasCalculated(true);
    }
  };

  const handleShare = async () => {
    if (lastCalculation && navigator.share) {
      try {
        await navigator.share({
          title: 'Calculator Result',
          text: `Here is my calculation from Quick Calculator+:\n${lastCalculation}`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Sharing failed",
          description: "Could not share the result at this time.",
        })
      }
    } else if (navigator.clipboard && lastCalculation) {
        navigator.clipboard.writeText(lastCalculation);
        toast({
          title: "Result Copied!",
          description: "The calculation has been copied to your clipboard.",
        })
    } else {
       toast({
          variant: "destructive",
          title: "Nothing to Share",
          description: "Perform a calculation first.",
        })
    }
  };
  
  const handleSquare = () => {
    setHasCalculated(false);
    const newExpression = `(${expression})^2`;
    setExpression(newExpression);
    setDisplayValue(newExpression);
  }

  const handleButtonClick = (action: () => void) => {
    playClickSound();
    action();
  }

  const renderButton = (key: string, className? : string, customClick?: () => void, customStyle?: React.CSSProperties) => {
    const isNumber = !isNaN(parseInt(key));
    const isDecimal = key === '.';
    const isBinaryOperator = ['/', '*', '-', '+', '^'].includes(key);
    const isUnaryOperator = ['√', 'log'].includes(key);
    const isSquare = key === 'x²';
    const isParenthesis = ['(', ')'].includes(key);
    const isEquals = key === '=';
    const isClear = key === 'C';
    
    let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'secondary';
    let style = customStyle;
    if(isBinaryOperator) variant = 'default';
    if(isEquals) {
      variant = 'default';
      style = { backgroundColor: '#4A90E2', color: 'white', ...customStyle };
    }
    if(isClear || isUnaryOperator || isParenthesis || isSquare) variant = 'outline';

    const iconMap: { [key:string]: React.ReactNode } = {
        '/': <Divide size={20} />,
        '*': <X size={20} />,
        '-': <Minus size={20} />,
        '+': <Plus size={20} />,
    };
    
    let finalClassName = `h-14 sm:h-16 text-xl sm:text-2xl transition-transform active:scale-95 rounded-xl ${className}`;

    const clickAction = () => {
        if (displayValue === "Error" && !isClear) {
            resetCalculator();
            return;
        }
        if (customClick) {
            customClick();
        } else if (isNumber) {
            inputDigit(key);
        } else if(isDecimal) {
            inputDecimal();
        } else if (isBinaryOperator) {
            handleOperator(key);
        } else if (isUnaryOperator) {
            handleUnaryOperation(key === '√' ? 'sqrt' : 'log');
        } else if (isSquare) {
            handleSquare();
        } else if (isParenthesis) {
            handleParenthesis(key);
        }
        else if (isEquals) {
            handleEquals();
        } else if (isClear) {
            resetCalculator();
        }
    }

    return (
        <Button
          key={key}
          variant={variant}
          size="lg"
          className={finalClassName}
          style={style}
          onClick={() => handleButtonClick(clickAction)}
        >
          {iconMap[key] || key}
        </Button>
    )
  }

  return (
    <Card className="w-full shadow-lg rounded-2xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Basic Calculator</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="bg-muted text-right rounded-lg p-3 break-all relative">
            <ScrollArea className="h-16 sm:h-20 mb-2">
                <div className="flex flex-col items-end gap-1 pr-2">
                  {history.slice(0, 5).reverse().map((item, index) => (
                    <p key={index} className={`text-muted-foreground text-xs ${index === 0 ? 'font-bold opacity-100' : 'opacity-70'}`}>
                      {item}
                    </p>
                  ))}
                </div>
            </ScrollArea>
             {lastCalculation && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 left-1 h-8 w-8"
                onClick={() => handleButtonClick(handleShare)}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            )}
            <p className="text-3xl sm:text-5xl font-light text-foreground">{displayValue}</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {renderButton('C', '', resetCalculator)}
            {renderButton('^')}
            {renderButton('√')}
            {renderButton('/')}

            {renderButton('x²')}
            {renderButton('log')}
            {renderButton('(')}
            {renderButton(')')}
            
            {renderButton('7')}
            {renderButton('8')}
            {renderButton('9')}
            {renderButton('*')}
            
            {renderButton('4')}
            {renderButton('5')}
            {renderButton('6')}
            {renderButton('-')}
            
            {renderButton('1')}
            {renderButton('2')}
            {renderButton('3')}
            {renderButton('+')}

            {renderButton('0', 'col-span-2')}
            {renderButton('.')}
            {renderButton('=')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicCalculator;

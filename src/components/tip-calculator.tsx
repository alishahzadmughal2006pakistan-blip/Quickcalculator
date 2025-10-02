'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Users, DollarSign, Percent } from 'lucide-react';

const TipCalculator = () => {
  const [bill, setBill] = useState('');
  const [tipPercentage, setTipPercentage] = useState('10');
  const [people, setPeople] = useState('1');
  const [roundUp, setRoundUp] = useState(false);

  const [tipAmount, setTipAmount] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [perPerson, setPerPerson] = useState(0);

  const calculateTip = () => {
    const billFloat = parseFloat(bill);
    const tipPercentFloat = parseFloat(tipPercentage);
    const peopleInt = parseInt(people, 10);

    if (isNaN(billFloat) || isNaN(tipPercentFloat) || isNaN(peopleInt) || peopleInt === 0) {
      setTipAmount(0);
      setTotalBill(0);
      setPerPerson(0);
      return;
    }

    let tip = billFloat * (tipPercentFloat / 100);
    let total = billFloat + tip;
    
    if (roundUp) {
      total = Math.ceil(total);
      tip = total - billFloat;
    }

    const perPersonAmount = total / peopleInt;

    setTipAmount(tip);
    setTotalBill(total);
    setPerPerson(perPersonAmount);
  };
  
  // Using useEffect to recalculate whenever an input value changes
  useEffect(() => {
    calculateTip();
  }, [bill, tipPercentage, people, roundUp]);


  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Tip Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bill">Total Bill</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="bill" type="number" placeholder="0.00" value={bill} onChange={(e) => setBill(e.target.value)} className="pl-10 text-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tip">Tip Percentage</Label>
            <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="tip" type="number" value={tipPercentage} onChange={(e) => setTipPercentage(e.target.value)} className="pl-10 text-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="people">Number of People</Label>
             <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="people" type="number" value={people} onChange={(e) => setPeople(e.target.value)} className="pl-10 text-lg" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="round-up" className="flex flex-col pr-4">
            <span className="font-semibold">Round Up Total</span>
            <span className="text-sm text-muted-foreground">Round the total bill to the nearest dollar.</span>
          </Label>
          <Switch id="round-up" checked={roundUp} onCheckedChange={setRoundUp} />
        </div>

        <div className="border-t border-border pt-4 mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tip Amount</span>
            <span className="text-xl sm:text-2xl font-semibold text-primary">
              ${tipAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Bill</span>
            <span className="text-xl sm:text-2xl font-semibold text-primary">
              ${totalBill.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
            <span className="text-muted-foreground font-bold">Amount Per Person</span>
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              ${perPerson.toFixed(2)}
            </span>
          </div>
        </div>
        
        <Button onClick={calculateTip} className="w-full h-12 text-lg font-bold text-white" style={{ backgroundColor: '#27AE60' }}>
            Recalculate
        </Button>
      </CardContent>
    </Card>
  );
};

export default TipCalculator;

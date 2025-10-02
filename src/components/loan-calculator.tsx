'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DollarSign, Percent, Calendar } from 'lucide-react';

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [tenureUnit, setTenureUnit] = useState('months');

  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

  const calculateLoan = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseInt(tenure, 10);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      setEmi(null);
      setTotalInterest(null);
      setTotalPayment(null);
      return;
    }

    const monthlyRate = r / (12 * 100);
    const numberOfMonths = tenureUnit === 'years' ? t * 12 : t;

    if (numberOfMonths === 0) return;

    const emiValue = (p * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
    const totalPaymentValue = emiValue * numberOfMonths;
    const totalInterestValue = totalPaymentValue - p;

    setEmi(emiValue);
    setTotalPayment(totalPaymentValue);
    setTotalInterest(totalInterestValue);
  };
  
  useEffect(() => {
    calculateLoan();
  }, [principal, rate, tenure, tenureUnit]);

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Loan/EMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="principal">Principal Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="principal" type="number" placeholder="100000" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="pl-10 text-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
                <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="rate" type="number" placeholder="5" value={rate} onChange={(e) => setRate(e.target.value)} className="pl-10 text-lg" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="tenure">Loan Tenure</Label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="tenure" type="number" placeholder="12" value={tenure} onChange={(e) => setTenure(e.target.value)} className="pl-10 text-lg" />
                </div>
                 <ToggleGroup type="single" value={tenureUnit} onValueChange={(value) => { if (value) setTenureUnit(value); }} className="w-full">
                  <ToggleGroupItem value="months" className="w-1/2">Months</ToggleGroupItem>
                  <ToggleGroupItem value="years" className="w-1/2">Years</ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>

        {emi !== null && totalInterest !== null && totalPayment !== null && (
          <div className="border-t border-border pt-4 mt-4 space-y-4">
             <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
                <span className="text-muted-foreground font-bold">Monthly EMI</span>
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                    ${emi.toFixed(2)}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="text-xl sm:text-2xl font-semibold text-primary">
                ${totalInterest.toFixed(2)}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Payment</span>
                <span className="text-xl sm:text-2xl font-semibold text-primary">
                ${totalPayment.toFixed(2)}
                </span>
            </div>
          </div>
        )}
        
        <Button onClick={calculateLoan} variant="destructive" className="w-full h-12 text-lg font-bold">
            Calculate
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoanCalculator;

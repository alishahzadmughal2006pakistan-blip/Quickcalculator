'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Percent, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Using the 28/36 rule for affordability estimation
const DTI_RATIO_HOUSING = 0.28; // Max percentage of gross income for housing
const DTI_RATIO_TOTAL = 0.36; // Max percentage of gross income for all debt

const LoanAffordabilityCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('0');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTerm, setLoanTerm] = useState('30'); // Years

  const [maxMonthlyPayment, setMaxMonthlyPayment] = useState<number | null>(null);
  const [maxLoanAmount, setMaxLoanAmount] = useState<number | null>(null);

  const calculateAffordability = () => {
    const income = parseFloat(monthlyIncome);
    const debts = parseFloat(monthlyDebts);
    const rate = parseFloat(interestRate);
    const termYears = parseInt(loanTerm, 10);

    if (isNaN(income) || isNaN(debts) || isNaN(rate) || isNaN(termYears) || income <= 0) {
      setMaxMonthlyPayment(null);
      setMaxLoanAmount(null);
      return;
    }

    // Calculate max payment based on Debt-to-Income (DTI) ratio
    const maxTotalDebtPayment = income * DTI_RATIO_TOTAL;
    const affordableMonthlyPayment = maxTotalDebtPayment - debts;
    
    if (affordableMonthlyPayment <= 0) {
        setMaxMonthlyPayment(0);
        setMaxLoanAmount(0);
        return;
    }

    setMaxMonthlyPayment(affordableMonthlyPayment);

    // Calculate max loan amount based on the affordable payment (reverse mortgage calculation)
    const monthlyInterestRate = rate / 100 / 12;
    const numberOfPayments = termYears * 12;
    
    if (monthlyInterestRate > 0) {
        const loanAmount = affordableMonthlyPayment * ( (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) / (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) );
        setMaxLoanAmount(loanAmount);
    } else {
        // If interest is 0, loan amount is just payment * term
        setMaxLoanAmount(affordableMonthlyPayment * numberOfPayments);
    }
  };

  useEffect(() => {
    if (monthlyIncome) {
        calculateAffordability();
    }
  }, [monthlyIncome, monthlyDebts, interestRate, loanTerm]);


  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Loan Affordability Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Gross Monthly Income</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="monthlyIncome" type="number" placeholder="5000" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} className="pl-10 text-lg" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyDebts">Existing Monthly Debts</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="monthlyDebts" type="number" placeholder="500" value={monthlyDebts} onChange={(e) => setMonthlyDebts(e.target.value)} className="pl-10 text-lg" />
            <p className="text-xs text-muted-foreground mt-1">Car payments, student loans, etc. (excluding rent).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="interestRate" type="number" placeholder="5" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="pl-10 text-lg" />
            </div>
          </div>
          <div className="space-y-2">
             <Label htmlFor="loanTerm">Loan Term</Label>
            <Select value={loanTerm} onValueChange={setLoanTerm}>
                <SelectTrigger id="loanTerm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="30">30 Years</SelectItem>
                    <SelectItem value="20">20 Years</SelectItem>
                    <SelectItem value="15">15 Years</SelectItem>
                    <SelectItem value="10">10 Years</SelectItem>
                    <SelectItem value="5">5 Years</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>

        {(maxLoanAmount !== null && maxMonthlyPayment !== null) && (
          <div className="border-t border-border pt-4 mt-4 space-y-4">
             <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
                <span className="text-muted-foreground font-bold">Max Monthly Payment</span>
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                    ${maxMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estimated Max Loan</span>
                <span className="text-xl sm:text-2xl font-semibold text-primary">
                ${maxLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </span>
            </div>
          </div>
        )}
        
        <Button onClick={calculateAffordability} className="w-full h-12 text-lg font-bold">
            Calculate
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoanAffordabilityCalculator;

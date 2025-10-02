'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLoanAffordabilitySuggestion } from '@/ai/flows/loan-affordability-flow';

const LoanAffordabilityCalculator = () => {
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [monthlyDebts, setMonthlyDebts] = useState('');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const [suggestion, setSuggestion] = useState<string | null>(null);

    const handleCalculate = () => {
        const incomeNum = parseFloat(monthlyIncome);
        const debtsNum = parseFloat(monthlyDebts);

        if (isNaN(incomeNum) || incomeNum <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Input',
                description: 'Please enter a valid monthly income.',
            });
            return;
        }
        if (isNaN(debtsNum) || debtsNum < 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Input',
                description: 'Please enter a valid monthly debt amount (or 0).',
            });
            return;
        }
        
        if (debtsNum >= incomeNum) {
            toast({
                variant: 'destructive',
                title: 'High Debt Ratio',
                description: 'Monthly debts cannot be greater than or equal to monthly income.',
            });
            return;
        }

        setSuggestion(null);

        startTransition(async () => {
            try {
                const result = await generateLoanAffordabilitySuggestion({
                    monthlyIncome: incomeNum,
                    monthlyDebts: debtsNum,
                });
                setSuggestion(result.suggestion);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Calculation Failed',
                    description: 'Could not generate a suggestion at this time. Please try again.',
                });
            }
        });
    };

    return (
        <Card className="w-full shadow-lg rounded-2xl animate-fade-in-scale">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-center">Loan Affordability AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="income">Your Monthly Income</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="income"
                                type="number"
                                placeholder="5000"
                                value={monthlyIncome}
                                onChange={(e) => setMonthlyIncome(e.target.value)}
                                className="pl-10 text-lg"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="debts">Monthly Debt Payments</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="debts"
                                type="number"
                                placeholder="500"
                                value={monthlyDebts}
                                onChange={(e) => setMonthlyDebts(e.target.value)}
                                className="pl-10 text-lg"
                            />
                        </div>
                    </div>
                </div>

                {(isPending || suggestion) && (
                    <div className="border-t border-border pt-4 mt-4 text-center space-y-4 min-h-[100px] flex flex-col justify-center">
                        {isPending ? (
                             <div className='flex justify-center items-center'>
                                <Loader className="animate-spin text-primary" />
                            </div>
                        ) : suggestion && (
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-muted-foreground font-bold mb-2">AI Suggestion</p>
                                <p className="text-md text-foreground">
                                    {suggestion}
                                </p>
                            </div>
                        )}
                    </div>
                )}
                
                <Button
                    onClick={handleCalculate}
                    className="w-full h-12 text-lg font-bold"
                    disabled={isPending}
                >
                    {isPending ? <Loader className="animate-spin" /> : 'Get Affordability Suggestion'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default LoanAffordabilityCalculator;

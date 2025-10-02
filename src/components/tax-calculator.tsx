'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DollarSign, Loader, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateTax } from '@/ai/flows/tax-calculator-flow';

const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'IN', name: 'India' },
];

const TaxCalculator = () => {
    const [income, setIncome] = useState('');
    const [country, setCountry] = useState('US');
    const [taxType, setTaxType] = useState('income'); // 'income' or 'vat'
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const [taxAmount, setTaxAmount] = useState<number | null>(null);
    const [effectiveRate, setEffectiveRate] = useState<number | null>(null);

    const handleCalculate = () => {
        const incomeNum = parseFloat(income);
        if (isNaN(incomeNum) || incomeNum < 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Input',
                description: 'Please enter a valid income amount.',
            });
            return;
        }

        setTaxAmount(null);
        setEffectiveRate(null);

        startTransition(async () => {
            try {
                const result = await calculateTax({
                    income: incomeNum,
                    country,
                    taxType,
                });
                setTaxAmount(result.taxAmount);
                setEffectiveRate(result.effectiveRate);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Calculation Failed',
                    description: 'Could not calculate tax at this time. Please try again.',
                });
            }
        });
    };

    return (
        <Card className="w-full shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-center">Tax Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="income">{taxType === 'income' ? 'Annual Income' : 'Amount (before tax)'}</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="income"
                            type="number"
                            placeholder="50000"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            className="pl-10 text-lg"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id="country">
                            <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(({ code, name }) => (
                                <SelectItem key={code} value={code}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label>Tax Type</Label>
                    <ToggleGroup type="single" value={taxType} onValueChange={(val) => {if(val) setTaxType(val)}} className="w-full">
                        <ToggleGroupItem value="income" className="w-1/2">Income Tax</ToggleGroupItem>
                        <ToggleGroupItem value="vat" className="w-1/2">VAT/GST</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                {(isPending || taxAmount !== null) && (
                    <div className="border-t border-border pt-4 mt-4 text-center space-y-4 min-h-[120px] flex flex-col justify-center">
                        {isPending ? (
                             <div className='flex justify-center items-center'>
                                <Loader className="animate-spin text-primary" />
                            </div>
                        ) : taxAmount !== null && (
                            <>
                                <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
                                    <span className="text-muted-foreground font-bold">Tax Amount</span>
                                    <span className="text-2xl sm:text-3xl font-bold text-primary">
                                        ${taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                {effectiveRate !== null && (
                                     <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Effective Rate</span>
                                        <span className="text-xl sm:text-2xl font-semibold text-primary">
                                            {effectiveRate.toFixed(2)}%
                                        </span>
                                    </div>
                                )}
                           </>
                        )}
                    </div>
                )}
                
                <Button
                    onClick={handleCalculate}
                    className="w-full h-12 text-lg font-bold"
                    style={{ backgroundColor: '#2ECC71', color: 'white' }}
                    disabled={isPending}
                >
                    {isPending ? <Loader className="animate-spin" /> : 'Calculate Tax'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default TaxCalculator;

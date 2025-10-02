'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Percent, Calendar } from 'lucide-react';

const compoundingFrequencies = {
    'Annually': 1,
    'Semi-Annually': 2,
    'Quarterly': 4,
    'Monthly': 12,
};

type Frequency = keyof typeof compoundingFrequencies;

const InvestmentReturnCalculator = () => {
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [time, setTime] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('Annually');

    const [futureValue, setFutureValue] = useState<number | null>(null);
    const [cagr, setCagr] = useState<number | null>(null);
    const [totalInvestment, setTotalInvestment] = useState<number| null>(null);
    const [totalInterest, setTotalInterest] = useState<number| null>(null);

    const calculateInvestment = () => {
        const p = parseFloat(principal);
        const r = parseFloat(rate) / 100; // Annual interest rate as a decimal
        const t = parseFloat(time); // Time in years
        const n = compoundingFrequencies[frequency];

        if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
            setFutureValue(null);
            setCagr(null);
            setTotalInvestment(null);
            setTotalInterest(null);
            return;
        }

        const fv = p * Math.pow(1 + r / n, n * t);
        const calculatedCagr = (Math.pow(fv / p, 1 / t) - 1) * 100;
        
        setFutureValue(fv);
        setCagr(calculatedCagr);
        setTotalInvestment(p);
        setTotalInterest(fv - p);
    };

    useEffect(() => {
        if(principal && rate && time){
            calculateInvestment();
        } else {
            setFutureValue(null);
            setCagr(null);
            setTotalInvestment(null);
            setTotalInterest(null);
        }
    }, [principal, rate, time, frequency]);

    return (
        <Card className="w-full shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-center">Investment Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="principal">Principal Amount</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="principal" type="number" placeholder="10000" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="pl-10 text-lg" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="rate">Annual Rate (%)</Label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="rate" type="number" placeholder="8" value={rate} onChange={(e) => setRate(e.target.value)} className="pl-10 text-lg" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time">Time (Years)</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="time" type="number" placeholder="5" value={time} onChange={(e) => setTime(e.target.value)} className="pl-10 text-lg" />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="frequency">Compounding Frequency</Label>
                    <Select value={frequency} onValueChange={(val) => setFrequency(val as Frequency)}>
                        <SelectTrigger id="frequency">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(compoundingFrequencies).map(freq => (
                                <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {(futureValue !== null && cagr !== null && totalInvestment !== null && totalInterest !== null) && (
                    <div className="border-t border-border pt-4 mt-4 space-y-4">
                        <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
                            <span className="text-muted-foreground font-bold">Future Value</span>
                            <span className="text-2xl sm:text-3xl font-bold text-primary">
                                ${futureValue.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Investment</span>
                            <span className="text-lg font-semibold">
                                ${totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Interest</span>
                            <span className="text-lg font-semibold">
                                ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">CAGR</span>
                            <span className="text-xl sm:text-2xl font-semibold text-primary">
                                {cagr.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                )}
                
                <Button 
                    onClick={calculateInvestment} 
                    className="w-full h-12 text-lg font-bold"
                    style={{ backgroundColor: '#F1C40F', color: '#343434' }}
                >
                    Calculate
                </Button>
            </CardContent>
        </Card>
    );
};

export default InvestmentReturnCalculator;

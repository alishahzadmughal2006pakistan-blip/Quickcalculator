'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, DollarSign } from 'lucide-react';

const popularCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    // Placeholder for API call
    console.log(`Converting ${amount} from ${fromCurrency} to ${toCurrency}`);
    // For now, just display a placeholder result
    const numAmount = parseFloat(amount);
    if(isNaN(numAmount)) {
        setResult(null);
        return;
    }
    // This is a fake conversion rate
    const fakeRate = 1.1; 
    setResult((numAmount * fakeRate).toFixed(2));
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="amount" type="number" placeholder="100.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-10 text-lg" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="fromCurrency">From</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger id="fromCurrency">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {popularCurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" className="mt-8" onClick={handleSwap}>
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 space-y-2">
            <Label htmlFor="toCurrency">To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger id="toCurrency">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {popularCurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="border-t border-border pt-4 mt-4 text-center space-y-2">
            <p className="text-muted-foreground">Converted Amount</p>
            <p className="text-3xl font-bold text-primary break-all">
              {result} {toCurrency}
            </p>
          </div>
        )}

        <Button onClick={handleConvert} className="w-full h-12 text-lg font-bold text-white" style={{ backgroundColor: '#2980B9' }}>
          Convert
        </Button>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;

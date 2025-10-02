'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { currencies } from '@/lib/currencies';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConvert = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !amount || !fromCurrency || !toCurrency) {
      setResult(null);
      setExchangeRate(null);
      return;
    }
    if (fromCurrency === toCurrency) {
      setResult(numAmount.toFixed(2));
      setExchangeRate(`1 ${fromCurrency} = 1 ${toCurrency}`);
      return;
    }

    setIsLoading(true);
    setResult(null);
    setExchangeRate(null);

    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (!res.ok) {
        throw new Error('Failed to fetch exchange rates.');
      }
      const data = await res.json();
      const rate = data.rates[toCurrency];

      if (!rate) {
          throw new Error('Conversion rate not available for the selected currency pair.');
      }
      
      const convertedAmount = numAmount * rate;
      setResult(convertedAmount.toFixed(2));
      setExchangeRate(`1 ${fromCurrency} = ${rate} ${toCurrency}`);

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: error.message || "Could not fetch the latest exchange rates.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
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
            <Input id="amount" type="number" placeholder="100.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg" />
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
                  {currencies.map(({code, name}) => <SelectItem key={code} value={code}>{code} - {name}</SelectItem>)}
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
                {currencies.map(({code, name}) => <SelectItem key={code} value={code}>{code} - {name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(isLoading || result) && (
          <div className="border-t border-border pt-4 mt-4 text-center space-y-2 min-h-[80px] flex flex-col justify-center">
            {isLoading ? (
                <div className='flex justify-center items-center'>
                    <Loader className="animate-spin text-primary" />
                </div>
            ) : result && (
                <>
                    <p className="text-muted-foreground">Converted Amount</p>
                    <p className="text-3xl font-bold text-primary break-all">
                    {result} {toCurrency}
                    </p>
                    {exchangeRate && <p className="text-sm text-muted-foreground">{exchangeRate}</p>}
                </>
            )}
          </div>
        )}

        <Button onClick={handleConvert} className="w-full h-12 text-lg font-bold" disabled={isLoading} style={{ backgroundColor: '#2980B9', color: 'white' }}>
          {isLoading ? <Loader className="animate-spin" /> : 'Convert'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;

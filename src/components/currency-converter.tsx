'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, DollarSign, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const popularCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'BRL', 'RUB', 'ZAR'];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConvert = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !amount) {
      setResult(null);
      return;
    }
    if (fromCurrency === toCurrency) {
      setResult(numAmount.toFixed(2));
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch(`https://api.frankfurter.app/latest?amount=${numAmount}&from=${fromCurrency}&to=${toCurrency}`);
      if (!res.ok) {
        throw new Error('Failed to fetch rates');
      }
      const data = await res.json();
      setResult(data.rates[toCurrency].toFixed(2));
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "Could not fetch the latest exchange rates. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(amount && fromCurrency && toCurrency) {
        handleConvert();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fromCurrency, toCurrency]);


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
                </>
            )}
          </div>
        )}

        <Button onClick={handleConvert} className="w-full h-12 text-lg font-bold text-white" style={{ backgroundColor: '#2980B9' }}>
          {isLoading ? <Loader className="animate-spin" /> : 'Convert'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;

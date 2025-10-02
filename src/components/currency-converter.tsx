'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCurrencies, setIsFetchingCurrencies] = useState(true);
  const [currencies, setCurrencies] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsFetchingCurrencies(true);
      try {
        const res = await fetch('https://api.frankfurter.app/currencies');
        if (!res.ok) {
          throw new Error('Could not fetch currency list');
        }
        const data = await res.json();
        setCurrencies(data);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error Loading Currencies',
          description: 'Could not load the list of available currencies. Please try again later.',
        });
      } finally {
        setIsFetchingCurrencies(false);
      }
    };
    fetchCurrencies();
  }, [toast]);

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
      const res = await fetch(`https://api.frankfurter.app/latest?amount=${numAmount}&from=${fromCurrency}&to=${toCurrency}`);
      if (!res.ok) {
        throw new Error('Failed to fetch rates');
      }
      const data = await res.json();
      const rate = data.rates[toCurrency];
      setResult(rate.toFixed(2));
      
      const singleUnitRes = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
      const singleUnitData = await singleUnitRes.json();
      setExchangeRate(`1 ${fromCurrency} = ${singleUnitData.rates[toCurrency].toFixed(4)} ${toCurrency}`);

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "Could not fetch the latest exchange rates. The selected currency pair may not be supported.",
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

  const currencyOptions = Object.entries(currencies);

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
            <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={isFetchingCurrencies}>
              <SelectTrigger id="fromCurrency">
                <SelectValue placeholder={isFetchingCurrencies ? "Loading..." : "From"} />
              </SelectTrigger>
              <SelectContent>
                {isFetchingCurrencies ? (
                    <SelectItem value="loading" disabled>Loading currencies...</SelectItem>
                ) : (
                    currencyOptions.map(([code, name]) => <SelectItem key={code} value={code}>{code} - {name}</SelectItem>)
                )}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" className="mt-8" onClick={handleSwap} disabled={isFetchingCurrencies}>
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 space-y-2">
            <Label htmlFor="toCurrency">To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency} disabled={isFetchingCurrencies}>
              <SelectTrigger id="toCurrency">
                <SelectValue placeholder={isFetchingCurrencies ? "Loading..." : "To"} />
              </SelectTrigger>
              <SelectContent>
                {isFetchingCurrencies ? (
                    <SelectItem value="loading" disabled>Loading currencies...</SelectItem>
                ) : (
                    currencyOptions.map(([code, name]) => <SelectItem key={code} value={code}>{code} - {name}</SelectItem>)
                )}
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

        <Button onClick={handleConvert} className="w-full h-12 text-lg font-bold text-white" style={{ backgroundColor: '#2980B9' }} disabled={isLoading || isFetchingCurrencies}>
          {isLoading ? <Loader className="animate-spin" /> : 'Convert'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;

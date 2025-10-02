'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Database } from 'lucide-react';

const units = {
    Byte: 1,
    Kilobyte: 1024,
    Megabyte: 1024 ** 2,
    Gigabyte: 1024 ** 3,
    Terabyte: 1024 ** 4,
    Petabyte: 1024 ** 5,
};

type Unit = keyof typeof units;

const DataStorageConverter = () => {
  const [fromUnit, setFromUnit] = useState<Unit>('Megabyte');
  const [toUnit, setToUnit] = useState<Unit>('Gigabyte');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const convert = useCallback(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || !value) {
      setResult(null);
      return;
    }

    const fromFactor = units[fromUnit];
    const toFactor = units[toUnit];
    
    const valueInBytes = numValue * fromFactor;
    const convertedValue = valueInBytes / toFactor;
    
    setResult(convertedValue.toLocaleString(undefined, { maximumFractionDigits: 5 }));
  }, [value, fromUnit, toUnit]);
  
  useEffect(() => {
    convert();
  }, [convert]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Data Storage Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor='value'>Value</Label>
            <div className="relative">
                <Database className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id='value' type="number" placeholder="1024" value={value} onChange={(e) => setValue(e.target.value)} className="pl-10 text-lg" />
            </div>
        </div>
      
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="fromUnit">From</Label>
            <Select value={fromUnit} onValueChange={(val) => setFromUnit(val as Unit)}>
                <SelectTrigger id="fromUnit" className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(units).map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" className="mt-8" onClick={handleSwap}>
            <ArrowRightLeft className="h-5 w-5"/>
          </Button>
          <div className="flex-1 space-y-2">
            <Label htmlFor="toUnit">To</Label>
            <Select value={toUnit} onValueChange={(val) => setToUnit(val as Unit)}>
                <SelectTrigger id="toUnit" className="w-full">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(units).map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="border-t border-border pt-4 mt-4 text-center space-y-2">
            <p className="text-muted-foreground">Result</p>
            <p className="text-3xl font-bold text-primary break-all">
              {result}
            </p>
             <p className="text-sm text-muted-foreground">{`${value} ${fromUnit} = ${result} ${toUnit}`}</p>
          </div>
        )}
        
        <Button onClick={convert} className="w-full h-12 text-lg font-bold text-white" style={{ backgroundColor: '#34495E' }}>
            Convert
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataStorageConverter;

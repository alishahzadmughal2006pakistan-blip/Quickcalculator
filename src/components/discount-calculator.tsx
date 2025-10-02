'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Percent } from 'lucide-react';

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [savedAmount, setSavedAmount] = useState<number | null>(null);

  const calculateDiscount = () => {
    const priceNum = parseFloat(originalPrice);
    const discountNum = parseFloat(discount);

    if (isNaN(priceNum) || isNaN(discountNum) || priceNum <= 0 || discountNum < 0) {
      setFinalPrice(null);
      setSavedAmount(null);
      return;
    }

    const saved = (priceNum * discountNum) / 100;
    const final = priceNum - saved;

    setSavedAmount(saved);
    setFinalPrice(final);
  };
  
  useEffect(() => {
    if(originalPrice && discount) {
        calculateDiscount();
    } else {
        setFinalPrice(null);
        setSavedAmount(null);
    }
  }, [originalPrice, discount]);

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Discount Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="originalPrice">Original Price</Label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="originalPrice" type="number" placeholder="100" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="pl-10 text-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="discount" type="number" placeholder="25" value={discount} onChange={(e) => setDiscount(e.target.value)} className="pl-10 text-lg" />
            </div>
          </div>
        </div>

        {(finalPrice !== null && savedAmount !== null) && (
          <div className="border-t border-border pt-4 mt-4 space-y-4">
             <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
                <span className="text-muted-foreground font-bold">Final Price</span>
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                    ${finalPrice.toFixed(2)}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">You Saved</span>
                <span className="text-xl sm:text-2xl font-semibold text-green-500">
                ${savedAmount.toFixed(2)}
                </span>
            </div>
          </div>
        )}
        
        <Button onClick={calculateDiscount} className="w-full h-12 text-lg font-bold text-white" style={{ backgroundColor: '#9B59B6' }}>
            Calculate
        </Button>
      </CardContent>
    </Card>
  );
};

export default DiscountCalculator;

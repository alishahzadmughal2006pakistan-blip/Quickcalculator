'use client';
import { useState } from 'react';
import { Calculator as CalculatorIcon, History as HistoryIcon, Scale } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Calculator from '@/components/calculator';
import History from '@/components/history';
import UnitConverter from '@/components/unit-converter';

export default function Home() {
  const [history, setHistory] = useState<string[]>([]);
  
  const handleAddToHistory = (calculation: string) => {
    // Add to history, keeping a max of 50 entries
    setHistory(prev => [calculation, ...prev.slice(0, 49)]);
  };
  
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl font-bold tracking-tight text-primary">SpeedCalc</CardTitle>
          <CardDescription>Quick, accurate, and smart calculations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator"><CalculatorIcon className="mr-2 h-4 w-4" /> Calculator</TabsTrigger>
              <TabsTrigger value="history"><HistoryIcon className="mr-2 h-4 w-4" /> History</TabsTrigger>
              <TabsTrigger value="converter"><Scale className="mr-2 h-4 w-4" /> Converter</TabsTrigger>
            </TabsList>
            <TabsContent value="calculator" className="mt-4">
              <Calculator addToHistory={handleAddToHistory} />
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <History history={history} onClear={handleClearHistory} />
            </TabsContent>
            <TabsContent value="converter" className="mt-4">
              <UnitConverter />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

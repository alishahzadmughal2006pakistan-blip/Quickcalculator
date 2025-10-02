'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Calculator from '@/components/calculator';

export default function Home() {
  const [history, setHistory] = useState<string[]>([]);
  
  const handleAddToHistory = (calculation: string) => {
    // Add to history, keeping a max of 50 entries
    setHistory(prev => [calculation, ...prev.slice(0, 49)]);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl font-bold tracking-tight text-primary">Quick Calculator+</CardTitle>
        </CardHeader>
        <CardContent>
           <Calculator addToHistory={handleAddToHistory} history={history} />
        </CardContent>
      </Card>
    </main>
  );
}

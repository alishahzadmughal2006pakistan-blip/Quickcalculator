'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, LayoutGrid, Wrench, Settings } from 'lucide-react';
import BasicCalculator from '@/components/calculator';
import TipCalculator from '@/components/tip-calculator';
import BmiCalculator from '@/components/bmi-calculator';
import PercentageCalculator from '@/components/percentage-calculator';
import AgeCalculator from '@/components/age-calculator';
import UnitConverter from '@/components/unit-converter';

export default function Home() {
  const [history, setHistory] = useState<string[]>([]);
  
  const handleAddToHistory = (calculation: string) => {
    // Add to history, keeping a max of 50 entries
    setHistory(prev => [calculation, ...prev.slice(0, 49)]);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-2 sm:p-4 font-body">
      <Card className="w-full max-w-6xl shadow-2xl rounded-2xl bg-card border-none sm:border">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl font-bold tracking-tight text-primary">Quick Calculator+</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <Tabs defaultValue="free" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="free"><Calculator className="w-4 h-4 mr-1" /> Free</TabsTrigger>
              <TabsTrigger value="advanced"><LayoutGrid className="w-4 h-4 mr-1" /> Advanced</TabsTrigger>
              <TabsTrigger value="tools"><Wrench className="w-4 h-4 mr-1" /> Tools</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1" /> Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="free" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                <div className="xl:col-span-2">
                  <BasicCalculator addToHistory={handleAddToHistory} history={history} />
                </div>
                <TipCalculator />
                <BmiCalculator />
                <PercentageCalculator />
                <AgeCalculator />
                <UnitConverter />
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="pt-4">
              <p className="text-center text-muted-foreground">Advanced calculators coming soon!</p>
            </TabsContent>
            <TabsContent value="tools" className="pt-4">
               <p className="text-center text-muted-foreground">Tools coming soon!</p>
            </TabsContent>
            <TabsContent value="settings" className="pt-4">
               <p className="text-center text-muted-foreground">Settings coming soon!</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

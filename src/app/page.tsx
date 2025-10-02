'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, LayoutGrid, Wrench, Settings, Trash2, Atom } from 'lucide-react';
import BasicCalculator from '@/components/calculator';
import TipCalculator from '@/components/tip-calculator';
import BmiCalculator from '@/components/bmi-calculator';
import PercentageCalculator from '@/components/percentage-calculator';
import AgeCalculator from '@/components/age-calculator';
import UnitConverter from '@/components/unit-converter';
import LoanCalculator from '@/components/loan-calculator';
import { ThemeToggle } from '@/components/theme-toggle';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SplashScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-screen bg-background animate-fade-in">
    <div className="flex items-center space-x-4">
      <Atom className="w-16 h-16 text-primary" />
      <h1 className="text-5xl font-bold text-primary">Quick Calculator+</h1>
    </div>
  </div>
);


export default function Home() {
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddToHistory = (calculation: string) => {
    // Add to history, keeping a max of 50 entries
    setHistory(prev => [calculation, ...prev.slice(0, 49)]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-2 sm:p-4 font-body">
      <Card className="w-full max-w-6xl shadow-2xl rounded-2xl bg-card border-none sm:border">
        <CardHeader className="text-center p-4 sm:p-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                  <div className="lg:col-span-1">
                    <BasicCalculator addToHistory={handleAddToHistory} history={history} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:col-span-2">
                      <TipCalculator />
                      <BmiCalculator />
                      <PercentageCalculator />
                      <AgeCalculator />
                      <UnitConverter />
                  </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                <LoanCalculator />
              </div>
            </TabsContent>
            <TabsContent value="tools" className="pt-4">
               <p className="text-center text-muted-foreground">Tools coming soon!</p>
            </TabsContent>
            <TabsContent value="settings" className="pt-4">
               <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="theme-toggle">Dark Mode</Label>
                        <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Calculation History</Label>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Clear History</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your calculation history.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearHistory}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

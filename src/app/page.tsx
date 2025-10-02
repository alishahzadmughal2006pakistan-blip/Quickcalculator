'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Atom, Settings, Trash2 } from 'lucide-react';
import BasicCalculator from '@/components/calculator';
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
import { AppLayout } from '@/components/layout';
import { allCalculators } from '@/lib/calculators';

const SplashScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-screen bg-background animate-fade-in">
    <div className="flex items-center space-x-4">
      <Atom className="w-16 h-16 text-primary" />
      <h1 className="text-5xl font-bold text-primary">Quick Calculator+</h1>
    </div>
  </div>
);

function HomePageContent() {
  const [history, setHistory] = useState<string[]>([]);
  const [activeCalculator, setActiveCalculator] = useState<string>('home');
  
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('calculatorHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  
  const handleAddToHistory = (calculation: string) => {
    setHistory(prev => [calculation, ...prev.slice(0, 49)]);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('calculatorHistory');
    } catch (error) {
      console.error("Failed to clear history from localStorage", error);
    }
  };

  const renderActiveCalculator = () => {
    if (activeCalculator === 'home') {
      return <BasicCalculator addToHistory={handleAddToHistory} history={history} />;
    }

    if(activeCalculator === 'settings') {
      return (
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
      );
    }
    
    const calculator = allCalculators.find(c => c.key === activeCalculator);
    if (calculator) {
      const CalculatorComponent = calculator.component;
      return <CalculatorComponent key={activeCalculator} />;
    }

    return null;
  };

  return (
    <AppLayout activeCalculator={activeCalculator} setActiveCalculator={setActiveCalculator}>
       {renderActiveCalculator()}
    </AppLayout>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return <HomePageContent />;
}

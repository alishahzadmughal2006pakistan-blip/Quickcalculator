'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Atom, Pin, PinOff, Settings, Trash2 } from 'lucide-react';
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
import { useSettings, SettingsProvider } from '@/hooks/use-settings';
import { FeatureLock } from '@/components/feature-lock';
import { Switch } from '@/components/ui/switch';
import { BannerAd } from '@/components/banner-ad';

const SplashScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-screen bg-background animate-fade-in">
    <div className="flex items-center space-x-4">
      <Atom className="w-16 h-16 text-primary" />
      <h1 className="text-5xl font-bold text-primary">Quick Calculator+</h1>
    </div>
  </div>
);

const SettingsScreen = () => {
    const { soundEnabled, toggleSound, isPremium, setPremium } = useSettings();

    const handleClearHistory = () => {
        try {
            localStorage.removeItem('calculatorHistory');
            // This is a bit of a hack, but it's the easiest way to get the
            // history to update in the basic calculator component.
            window.location.reload();
        } catch (error) {
            console.error("Failed to clear history from localStorage", error);
        }
    };
    
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
                    <Label htmlFor="sound-toggle">Sound Effects</Label>
                    <Switch id="sound-toggle" checked={soundEnabled} onCheckedChange={toggleSound} />
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
                <div className="border-t pt-4">
                     <div className="flex flex-col items-center space-y-2">
                        <Label>{isPremium ? "You are a Premium User!" : "Remove Ads & Unlock All Features"}</Label>
                        <Button 
                            onClick={() => setPremium(!isPremium)}
                            className="w-full"
                            variant={isPremium ? 'outline' : 'default'}
                            >
                           {isPremium ? "Revert to Free Version" : "Upgrade to Premium"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


function HomePageContent() {
  const [history, setHistory] = useState<string[]>([]);
  const [activeCalculator, setActiveCalculator] = useState<string>('home');
  const { pinnedCalculators, togglePinnedCalculator, isPremium } = useSettings();
  
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

  const renderActiveCalculator = () => {
    if (activeCalculator === 'home') {
        const pinned = allCalculators.filter(c => pinnedCalculators.includes(c.key));

        return (
            <div className='space-y-4'>
                <div className="relative">
                    <BasicCalculator addToHistory={handleAddToHistory} history={history} />
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-2 right-2"
                        onClick={() => togglePinnedCalculator('home')}
                    >
                        {pinnedCalculators.includes('home') ? <PinOff className='text-primary' /> : <Pin />}
                    </Button>
                </div>
                
                {pinned.map(calculator => {
                    const CalculatorComponent = calculator.component;
                     const isPinned = pinnedCalculators.includes(calculator.key);
                    return (
                        <div key={calculator.key} className="relative">
                            <CalculatorComponent />
                             <Button 
                                size="icon" 
                                variant="ghost" 
                                className="absolute top-2 right-2"
                                onClick={() => togglePinnedCalculator(calculator.key)}
                            >
                                {isPinned ? <PinOff className='text-primary' /> : <Pin />}
                            </Button>
                        </div>
                    );
                })}
            </div>
        )
    }

    if(activeCalculator === 'settings') {
      return <SettingsScreen />;
    }
    
    const calculator = allCalculators.find(c => c.key === activeCalculator);
    if (calculator) {
      const CalculatorComponent = calculator.component;
      const isAdvanced = calculator.category === 'advanced';
      const isFree = calculator.category === 'free';
      const isPinned = pinnedCalculators.includes(calculator.key);

      const mainContent = (
         <div className="relative">
            <CalculatorComponent key={activeCalculator} />
            <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2 z-10"
                onClick={() => togglePinnedCalculator(calculator.key)}
            >
                {isPinned ? <PinOff className='text-primary' /> : <Pin />}
            </Button>
        </div>
      );

      const componentToRender = isAdvanced ? (
        <FeatureLock featureKey={calculator.key} featureName={calculator.title}>
          {mainContent}
        </FeatureLock>
      ) : mainContent;

      return (
        <div className="space-y-4">
            {componentToRender}
            {isFree && !isPremium && <BannerAd />}
        </div>
      );
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

  return (
    <SettingsProvider>
      <HomePageContent />
    </SettingsProvider>
  );
}

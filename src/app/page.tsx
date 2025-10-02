
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, Pin, PinOff, Trash2 } from 'lucide-react';
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
import SplashScreen from '@/components/splash-screen';

const SettingsScreen = () => {
    const { soundEnabled, toggleSound, isPremium, setPremium } = useSettings();

    const handleClearHistory = () => {
        try {
            localStorage.removeItem('calculatorHistory');
            window.location.reload();
        } catch (error) {
            console.error("Failed to clear history from localStorage", error);
        }
    };
    
    return (
        <Card className="w-full max-w-md mx-auto animate-fade-in-scale">
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
                {!isPremium && (
                    <div className="border-t pt-4">
                        <Card className="bg-gradient-to-br from-primary to-accent border-primary/20 text-center p-6 space-y-4">
                             <div className="flex justify-center">
                                <Gem className="w-12 h-12 text-primary-foreground" />
                            </div>
                            <h3 className="text-xl font-bold text-primary-foreground">Go Premium!</h3>
                            <p className="text-sm text-primary-foreground/80">Remove ads and unlock all advanced calculators permanently.</p>
                            <Button 
                                onClick={() => setPremium(true)}
                                className="w-full bg-background text-foreground hover:bg-background/90"
                                size="lg"
                            >
                                Upgrade to Premium
                            </Button>
                        </Card>
                    </div>
                )}
                 {isPremium && (
                    <div className="border-t pt-4 text-center space-y-2">
                        <p className="font-semibold text-primary">You are a Premium user!</p>
                         <Button 
                            onClick={() => setPremium(false)}
                            className="w-full"
                            variant='outline'
                            >
                           Revert to Free Version
                        </Button>
                    </div>
                )}
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
        const pinned = allCalculators.filter(c => c.key !== 'home' && pinnedCalculators.includes(c.key));

        return (
            <div className='space-y-4 animate-fade-in-scale'>
                <div className="relative">
                    <BasicCalculator addToHistory={handleAddToHistory} history={history} />
                </div>
                
                {pinned.length > 0 ? (
                    pinned.map(calculator => {
                        const CalculatorComponent = calculator.component;
                        return (
                            <div key={calculator.key} className="relative group animate-fade-in-scale">
                                <CalculatorComponent />
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onClick={() => togglePinnedCalculator(calculator.key)}
                                >
                                    <PinOff className='text-primary' />
                                </Button>
                            </div>
                        );
                    })
                ) : (
                    <Card className="text-center p-8 border-dashed">
                        <p className="text-muted-foreground">Pin your favorite calculators from the menu to see them here for quick access!</p>
                    </Card>
                )}
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
         <div className="relative group animate-fade-in-scale">
            <CalculatorComponent key={activeCalculator} />
            <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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

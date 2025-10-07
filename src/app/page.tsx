
'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, Pin, PinOff, Trash2, History, FileText } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

declare global {
    interface Window {
        handlePurchase?: () => void;
        handleRestorePurchase?: () => void;
        isAndroidApp?: boolean;
        androidPurchase?: {
          purchase: () => void;
        };
        Android?: {
          purchasePremium: () => void;
        }
    }
}

const SettingsScreen = () => {
    const { soundEnabled, toggleSound, isPremium, setPremium } = useSettings();
    const { toast } = useToast();

    useEffect(() => {
        const handlePurchaseEvent = () => {
          setPremium(true);
          toast({
            title: "Purchase Successful!",
            description: "Premium membership activated!",
          });
        };
      
        // These custom events would be dispatched from your native Android code
        // after a successful purchase or restore operation via the Google Play Billing library.
        window.addEventListener('purchaseSuccess', handlePurchaseEvent as EventListener);
        window.addEventListener('purchaseRestored', handlePurchaseEvent as EventListener);
      
        return () => {
          window.removeEventListener('purchaseSuccess', handlePurchaseEvent as EventListener);
          window.removeEventListener('purchaseRestored', handlePurchaseEvent as EventListener);
        };
    }, [setPremium, toast]);

    useEffect(() => {
        // Listen for Android ready event
        const handleAndroidReady = () => {
            console.log('🟢 Android interface is ready!');
            toast({
                title: "Android Billing Ready",
                description: "Real Google Play billing is available",
            });
        };

        window.addEventListener('androidReady', handleAndroidReady);

        return () => {
            window.removeEventListener('androidReady', handleAndroidReady);
        };
    }, [toast]);


    const handleClearHistory = () => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem('calculatorHistory');
                toast({
                    title: "History Cleared",
                    description: "Your calculation history has been deleted.",
                });
                 // We can reload to ensure the UI updates everywhere
                setTimeout(() => window.location.reload(), 500);
            } catch (error) {
                console.error("Failed to clear history from localStorage", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not clear history.",
                });
            }
        }
    };

    const handleRestorePurchase = () => {
        // =================================================================================
        // TODO: GOOGLE PLAY BILLING INTEGRATION - RESTORE PURCHASE
        // =================================================================================
        // 1. Check if the custom `handleRestorePurchase` function exists on the window object.
        //    This function should be injected by your Android WebView wrapper.
        // 2. If it exists, call it. This function will trigger the native Google Play
        //    Billing SDK's logic to query for existing purchases.
        // 3. The native code should then dispatch a 'purchaseRestored' event upon success,
        //    which the `useEffect` in this component will listen for.
        if (window.handleRestorePurchase) {
            window.handleRestorePurchase();
        } else {
            // This is a fallback for web development and testing.
            console.log("Simulating restore purchase...");
            setPremium(true);
            toast({
                title: "Purchase Restored",
                description: "Your premium access has been successfully restored (Web simulation).",
            });
        }
    }
    
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
                 <div className="border-t pt-4">
                    <Link href="/privacy" passHref>
                         <Button variant="outline" className="w-full justify-start">
                            <FileText className="mr-2 h-4 w-4" />
                            Privacy Policy
                        </Button>
                    </Link>
                </div>
                {!isPremium && (
                    <div className="border-t pt-4 space-y-4">
                        {/* TEST BUTTON - Add this to your SettingsScreen */}
                        <Button 
                          onClick={() => {
                            console.log("=== ANDROID DEBUG ===");
                            console.log("handlePurchase:", typeof window.handlePurchase);
                            console.log("isAndroidApp:", window.isAndroidApp);
                            console.log("Android object:", typeof Android);
                            
                            // Try multiple methods
                            if (window.handlePurchase) {
                              console.log("✅ Method 1: window.handlePurchase is available");
                              window.handlePurchase();
                            } else if (window.androidPurchase) {
                              console.log("✅ Method 2: window.androidPurchase is available");
                              window.androidPurchase.purchase();
                            } else if (typeof Android !== 'undefined') {
                              console.log("✅ Method 3: Android object is available");
                              Android.purchasePremium();
                            } else {
                              console.log("❌ No Android methods available");
                              alert("No Android connection detected");
                            }
                          }}
                          style={{ 
                            backgroundColor: 'red', 
                            color: 'white',
                            marginTop: '10px'
                          }}
                        >
                          🧪 TEST ANDROID CONNECTION
                        </Button>
                        <Card className="bg-gradient-to-br from-blue-500 to-rose-500 border-primary/20 text-center p-6 space-y-4">
                             <div className="flex justify-center">
                                <Gem className="w-12 h-12 text-primary-foreground" />
                            </div>
                            <h3 className="text-xl font-bold text-primary-foreground">Go Premium!</h3>
                            <p className="text-sm text-primary-foreground/80">Remove ads and unlock all advanced calculators permanently.</p>
                            <Button 
                                onClick={() => {
                                    // =========================================================================
                                    // TODO: GOOGLE PLAY BILLING INTEGRATION - INITIATE PURCHASE
                                    // =========================================================================
                                    // 1. Check if the custom `handlePurchase` function exists on the window object.
                                    //    This function should be injected by your Android WebView wrapper.
                                    // 2. If it exists, call it. This function will trigger the native Google Play
                                    //    Billing SDK to launch the purchase flow for your "premium" product.
                                    // 3. The native code should then dispatch a 'purchaseSuccess' event upon success,
                                    //    which the `useEffect` in this component will listen for.
                                    if (window.handlePurchase) {
                                        window.handlePurchase();
                                    } else {
                                        // This is a fallback for web development and testing.
                                        console.log("Simulating premium purchase...");
                                        setPremium(true); 
                                        toast({
                                            title: "Purchase Successful!",
                                            description: "Premium activated (Web simulation).",
                                        });
                                      }
                                }}
                                className="w-full bg-background text-foreground hover:bg-background/90"
                                size="lg"
                            >
                                Upgrade Now for $1.99
                            </Button>
                        </Card>
                         <Button 
                            onClick={handleRestorePurchase}
                            variant="ghost"
                            className="w-full"
                        >
                            <History className="mr-2 h-4 w-4" />
                           Restore Purchase
                        </Button>
                    </div>
                )}
                 {isPremium && (
                    <div className="border-t pt-4 text-center space-y-2">
                        <div className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg">
                            <Gem className="w-8 h-8 text-primary" />
                            <p className="font-semibold text-primary">You are a Premium user!</p>
                            <p className="text-sm text-muted-foreground">All features are unlocked and ads are removed.</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


function HomePageContent() {
  const [history, setHistory] = useState<string[]>([]);
  const { pinnedCalculators, togglePinnedCalculator, isPremium } = useSettings();
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCalculator = searchParams.get('calculator') || 'home';

  const setActiveCalculator = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('calculator', key);
    router.push(`${pathname}?${params.toString()}`);
  };
  
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
            <div className='space-y-4'>
                <div className="relative animate-fade-in-scale">
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
                    <Card className="text-center p-8 border-dashed animate-fade-in-scale">
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
             {calculator.key !== 'home' && (
                <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => togglePinnedCalculator(calculator.key)}
                >
                    {isPinned ? <PinOff className='text-primary' /> : <Pin />}
                </Button>
            )}
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient) {
    return <SplashScreen />;
  }

  return (
    <SettingsProvider>
      <HomePageContent />
    </SettingsProvider>
  );
}

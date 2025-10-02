'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, LayoutGrid, Wrench, Settings, Trash2, Atom, Pin, PinOff } from 'lucide-react';
import BasicCalculator from '@/components/calculator';
import TipCalculator from '@/components/tip-calculator';
import BmiCalculator from '@/components/bmi-calculator';
import PercentageCalculator from '@/components/percentage-calculator';
import AgeCalculator from '@/components/age-calculator';
import UnitConverter from '@/components/unit-converter';
import LoanCalculator from '@/components/loan-calculator';
import CurrencyConverter from '@/components/currency-converter';
import ScientificCalculator from '@/components/scientific-calculator';
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
import DateCalculator from '@/components/date-calculator';
import DiscountCalculator from '@/components/discount-calculator';
import DataStorageConverter from '@/components/data-storage-converter';
import TaxCalculator from '@/components/tax-calculator';
import InvestmentReturnCalculator from '@/components/investment-return-calculator';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';

const SplashScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-screen bg-background animate-fade-in">
    <div className="flex items-center space-x-4">
      <Atom className="w-16 h-16 text-primary" />
      <h1 className="text-5xl font-bold text-primary">Quick Calculator+</h1>
    </div>
  </div>
);

type PinnedItems = {
  [key: string]: boolean;
};

const allCalculators = {
  tip: { component: <TipCalculator />, title: "Tip Calculator" },
  bmi: { component: <BmiCalculator />, title: "BMI Calculator" },
  percentage: { component: <PercentageCalculator />, title: "Percentage Calculator" },
  age: { component: <AgeCalculator />, title: "Age Calculator" },
  unit: { component: <UnitConverter />, title: "Unit Converter" },
  loan: { component: <LoanCalculator />, title: "Loan/EMI Calculator" },
  currency: { component: <CurrencyConverter />, title: "Currency Converter" },
  scientific: { component: <ScientificCalculator />, title: "Scientific Calculator" },
  tax: { component: <TaxCalculator />, title: "Tax Calculator" },
  investment: { component: <InvestmentReturnCalculator />, title: "Investment Calculator" },
  date: { component: <DateCalculator />, title: "Date Calculator" },
  discount: { component: <DiscountCalculator />, title: "Discount Calculator" },
  data: { component: <DataStorageConverter />, title: "Data Storage Converter" },
};

export default function Home() {
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCalculator, setActiveCalculator] = useState<string | null>('home');
  const [pinnedItems, setPinnedItems] = useState<PinnedItems>({});

  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => setLoading(false), 2000);
    
    try {
      const storedHistory = localStorage.getItem('calculatorHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      const storedPins = localStorage.getItem('pinnedCalculators');
      if (storedPins) {
        setPinnedItems(JSON.parse(storedPins));
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('pinnedCalculators', JSON.stringify(pinnedItems));
    } catch (error) {
      console.error("Failed to save pinned items to localStorage", error);
    }
  }, [pinnedItems]);
  
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

  const togglePin = (key: string) => {
    setPinnedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderActiveCalculator = () => {
    if (activeCalculator === 'home') {
      const pinnedCalculators = Object.entries(pinnedItems)
        .filter(([, isPinned]) => isPinned)
        .map(([key]) => ({ key, ...allCalculators[key as keyof typeof allCalculators] }));

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
           <div className="md:col-span-2 xl:col-span-3">
              <BasicCalculator addToHistory={handleAddToHistory} history={history} />
           </div>
          {pinnedCalculators.map(({ key, component, title }) => (
             <div key={key} className="relative group">
                {component}
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground group-hover:text-foreground" onClick={() => togglePin(key)}>
                  <PinOff className="w-5 h-5" />
                </Button>
            </div>
          ))}
        </div>
      )
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
    
    const calculator = allCalculators[activeCalculator as keyof typeof allCalculators];
    if (calculator) {
      const isPinned = pinnedItems[activeCalculator as keyof typeof allCalculators];
      return (
        <div className="relative group max-w-4xl mx-auto">
          {calculator.component}
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground group-hover:text-foreground" onClick={() => togglePin(activeCalculator as keyof typeof allCalculators)}>
            {isPinned ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
          </Button>
        </div>
      );
    }

    return null;
  };

  const menuItems = {
    free: [
      { key: 'tip', title: 'Tip Calculator' },
      { key: 'bmi', title: 'BMI Calculator' },
      { key: 'percentage', title: 'Percentage Calculator' },
      { key: 'age', title: 'Age Calculator' },
      { key: 'unit', title: 'Unit Converter' },
    ],
    advanced: [
      { key: 'loan', title: 'Loan/EMI Calculator' },
      { key: 'currency', title: 'Currency Converter' },
      { key: 'scientific', title: 'Scientific Calculator' },
      { key: 'tax', title: 'Tax Calculator' },
      { key: 'investment', title: 'Investment Calculator' },
    ],
    tools: [
      { key: 'date', title: 'Date Calculator' },
      { key: 'discount', title: 'Discount Calculator' },
      { key: 'data', title: 'Data Storage Converter' },
    ],
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveCalculator('home')} isActive={activeCalculator === 'home'}><Calculator /> Home</SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarGroup>
              <SidebarGroupLabel>Free</SidebarGroupLabel>
              {menuItems.free.map(({key, title}) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton onClick={() => setActiveCalculator(key)} isActive={activeCalculator === key}>{title}</SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>

             <SidebarGroup>
              <SidebarGroupLabel>Advanced</SidebarGroupLabel>
              {menuItems.advanced.map(({key, title}) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton onClick={() => setActiveCalculator(key)} isActive={activeCalculator === key}>{title}</SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>

             <SidebarGroup>
              <SidebarGroupLabel>Tools</SidebarGroupLabel>
              {menuItems.tools.map(({key, title}) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton onClick={() => setActiveCalculator(key)} isActive={activeCalculator === key}>{title}</SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>

             <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveCalculator('settings')} isActive={activeCalculator === 'settings'}><Settings /> Settings</SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 min-h-screen p-4 sm:p-6 md:p-8 bg-muted/40">
        <header className="flex items-center justify-between md:justify-end mb-4">
          <SidebarTrigger className="md:hidden" />
           <h1 className="text-2xl font-bold text-primary md:hidden">Quick Calculator+</h1>
           <div />
        </header>
        {renderActiveCalculator()}
      </main>
    </SidebarProvider>
  );
}

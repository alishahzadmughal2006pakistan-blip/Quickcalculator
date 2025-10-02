'use client';
import { Calculator, LayoutGrid, Wrench, Settings, Atom } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { allCalculators } from '@/lib/calculators';
import { useState } from 'react';

interface BottomNavbarProps {
  activeCalculator: string;
  setActiveCalculator: (key: string) => void;
}

const navItems = [
    { key: 'home', icon: <Calculator />, label: 'Calculator' },
    { key: 'free', icon: <LayoutGrid />, label: 'Free' },
    { key: 'advanced', icon: <Wrench />, label: 'Advanced' },
    { key: 'tools', icon: <Atom />, label: 'Tools' },
    { key: 'settings', icon: <Settings />, label: 'Settings' },
];

const categories = {
    free: allCalculators.filter(c => c.category === 'free'),
    advanced: allCalculators.filter(c => c.category === 'advanced'),
    tools: allCalculators.filter(c => c.category === 'tools'),
};


const MenuSheetContent = ({ category, setActiveCalculator, closeSheet }: { category: 'free' | 'advanced' | 'tools', setActiveCalculator: (key: string) => void, closeSheet: () => void }) => {
    
    const handleSelect = (key: string) => {
        setActiveCalculator(key);
        closeSheet();
    }
    
    return (
        <SheetContent side="bottom" className="rounded-t-lg">
            <SheetHeader className="mb-4">
                <SheetTitle className="capitalize text-center">{category} Calculators</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2">
                {categories[category].map(item => (
                    <Button
                        key={item.key}
                        variant="outline"
                        className="justify-center h-16 text-center"
                        onClick={() => handleSelect(item.key)}
                    >
                        {item.title}
                    </Button>
                ))}
            </div>
        </SheetContent>
    )
}

export default function BottomNavbar({ activeCalculator, setActiveCalculator }: BottomNavbarProps) {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-50 md:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map(item => {
            const isActive = activeCalculator === item.key || (allCalculators.find(c => c.key === activeCalculator)?.category === item.key);
            
            if (item.key === 'free' || item.key === 'advanced' || item.key === 'tools') {
                return (
                     <Sheet key={item.key} open={isSheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                             <Button variant="ghost" className={cn("flex flex-col h-full w-full rounded-none", isActive && 'text-primary')}>
                                {item.icon}
                                <span className="text-xs">{item.label}</span>
                            </Button>
                        </SheetTrigger>
                       <MenuSheetContent category={item.key as 'free' | 'advanced' | 'tools'} setActiveCalculator={setActiveCalculator} closeSheet={() => setSheetOpen(false)} />
                    </Sheet>
                )
            }

            return (
                <Button
                    key={item.key}
                    variant="ghost"
                    className={cn("flex flex-col h-full w-full rounded-none", isActive && 'text-primary')}
                    onClick={() => setActiveCalculator(item.key)}
                >
                    {item.icon}
                    <span className="text-xs">{item.label}</span>
                </Button>
            )
        })}
      </div>
    </div>
  );
}

'use client';
import { Calculator, LayoutGrid, Wrench, Settings, Atom } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { allCalculators } from '@/lib/calculators';

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


const MenuPopoverContent = ({ category, setActiveCalculator }: { category: 'free' | 'advanced' | 'tools', setActiveCalculator: (key: string) => void }) => {
    return (
        <PopoverContent className="w-[90vw] max-w-sm p-2 md:w-64">
            <div className="grid gap-2">
                {categories[category].map(item => (
                    <Button
                        key={item.key}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => setActiveCalculator(item.key)}
                    >
                        {item.title}
                    </Button>
                ))}
            </div>
        </PopoverContent>
    )
}

export default function BottomNavbar({ activeCalculator, setActiveCalculator }: BottomNavbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-50 md:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map(item => {
            const isActive = activeCalculator === item.key || (allCalculators.find(c => c.key === activeCalculator)?.category === item.key);
            
            if (item.key === 'free' || item.key === 'advanced' || item.key === 'tools') {
                return (
                     <Popover key={item.key}>
                        <PopoverTrigger asChild>
                             <Button variant="ghost" className={cn("flex flex-col h-full w-full rounded-none", isActive && 'text-primary')}>
                                {item.icon}
                                <span className="text-xs">{item.label}</span>
                            </Button>
                        </PopoverTrigger>
                       <MenuPopoverContent category={item.key as 'free' | 'advanced' | 'tools'} setActiveCalculator={setActiveCalculator} />
                    </Popover>
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

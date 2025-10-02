'use client';
import React from 'react';
import { Calculator, Settings, LayoutGrid, Wrench } from 'lucide-react';
import BottomNavbar from './bottom-navbar';
import { allCalculators } from '@/lib/calculators';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface AppLayoutProps {
    children: React.ReactNode;
    activeCalculator: string;
    setActiveCalculator: (key: string) => void;
}

const DesktopSidebar = ({ activeCalculator, setActiveCalculator }: { activeCalculator: string; setActiveCalculator: (key: string) => void; }) => {
    const categories = {
        free: allCalculators.filter(c => c.category === 'free'),
        advanced: allCalculators.filter(c => c.category === 'advanced'),
        tools: allCalculators.filter(c => c.category === 'tools'),
    };

    return (
        <aside className="hidden md:block w-64 bg-card border-r h-screen sticky top-0">
            <ScrollArea className="h-full">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-primary mb-4">Quick Calc+</h1>
                    <nav className="flex flex-col gap-1">
                        <Button
                            variant={activeCalculator === 'home' ? 'secondary' : 'ghost'}
                            className="justify-start gap-2"
                            onClick={() => setActiveCalculator('home')}
                        >
                            <Calculator /> Home
                        </Button>
                        <div>
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase my-2 px-2">Free</h3>
                            {categories.free.map(item => (
                                <Button
                                    key={item.key}
                                    variant={activeCalculator === item.key ? 'secondary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveCalculator(item.key)}
                                >
                                    {item.title}
                                </Button>
                            ))}
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase my-2 px-2">Advanced</h3>
                            {categories.advanced.map(item => (
                                <Button
                                    key={item.key}
                                    variant={activeCalculator === item.key ? 'secondary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveCalculator(item.key)}
                                >
                                    {item.title}
                                </Button>
                            ))}
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase my-2 px-2">Tools</h3>
                            {categories.tools.map(item => (
                                <Button
                                    key={item.key}
                                    variant={activeCalculator === item.key ? 'secondary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveCalculator(item.key)}
                                >
                                    {item.title}
                                </Button>
                            ))}
                        </div>
                         <Button
                            variant={activeCalculator === 'settings' ? 'secondary' : 'ghost'}
                            className="justify-start gap-2 mt-4"
                            onClick={() => setActiveCalculator('settings')}
                        >
                            <Settings /> Settings
                        </Button>
                    </nav>
                </div>
            </ScrollArea>
        </aside>
    );
};


export const AppLayout = ({ children, activeCalculator, setActiveCalculator }: AppLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-muted/40">
            <DesktopSidebar activeCalculator={activeCalculator} setActiveCalculator={setActiveCalculator} />
            <main className="flex-1 pb-16 md:pb-0 p-4 sm:p-6 md:p-8">
                {children}
            </main>
            <BottomNavbar activeCalculator={activeCalculator} setActiveCalculator={setActiveCalculator} />
        </div>
    );
};

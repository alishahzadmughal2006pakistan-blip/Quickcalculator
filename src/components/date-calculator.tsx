'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, intervalToDuration } from 'date-fns';
import { Label } from './ui/label';

const DateCalculator = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [duration, setDuration] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateDuration = () => {
    if (!startDate || !endDate) {
        setDuration(null);
        return;
    };
    if (startDate > endDate) {
        setDuration(null); // Or show an error
        return;
    }

    const result = intervalToDuration({ start: startDate, end: endDate });
    setDuration({
        years: result.years ?? 0,
        months: result.months ?? 0,
        days: result.days ?? 0,
    });
  };

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Date Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
            <div className='space-y-2'>
                <Label>Start Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal h-12 text-base",
                            !startDate && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
            <div className='space-y-2'>
                <Label>End Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal h-12 text-base",
                            !endDate && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
        </div>

        {duration && (
          <div className="border-t border-border pt-4 mt-4 text-center space-y-4">
            <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="text-3xl font-bold text-primary">
                    {duration.years} <span className="text-xl font-medium">years</span>, {duration.months} <span className="text-xl font-medium">months</span>, {duration.days} <span className="text-xl font-medium">days</span>
                </p>
            </div>
          </div>
        )}
        
        <Button onClick={calculateDuration} className="w-full h-12 text-lg font-bold" disabled={!startDate || !endDate}>
            Calculate Duration
        </Button>
      </CardContent>
    </Card>
  );
};

export default DateCalculator;

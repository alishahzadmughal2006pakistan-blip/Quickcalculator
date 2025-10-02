'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, differenceInYears, differenceInMonths, differenceInDays, addYears, intervalToDuration } from 'date-fns';

const AgeCalculator = () => {
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);
  const [nextBirthday, setNextBirthday] = useState<{ months: number; days: number } | null>(null);

  const calculateAge = () => {
    if (!dateOfBirth) return;

    const today = new Date();
    const years = differenceInYears(today, dateOfBirth);
    const months = differenceInMonths(today, dateOfBirth) % 12;
    
    // This is a bit tricky, need to account for days in month
    let tempDate = new Date(dateOfBirth);
    tempDate.setFullYear(tempDate.getFullYear() + years);
    tempDate.setMonth(tempDate.getMonth() + months);
    const days = differenceInDays(today, tempDate);

    setAge({ years, months, days });

    // Calculate next birthday
    let nextBdayDate = new Date(dateOfBirth.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate());
    if(nextBdayDate < today) {
        nextBdayDate = addYears(nextBdayDate, years + 1);
    } else {
        nextBdayDate = addYears(nextBdayDate, years);
    }
    
    const duration = intervalToDuration({ start: today, end: nextBdayDate });
    setNextBirthday({ months: duration.months ?? 0, days: duration.days ?? 0 });
  };

  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Age Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal h-12 text-base",
                        !dateOfBirth && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date of birth</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={setDateOfBirth}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    />
                </PopoverContent>
            </Popover>
        </div>

        {age && (
          <div className="border-t border-border pt-4 mt-4 text-center space-y-4">
            <div>
                <p className="text-muted-foreground">Your Age Is</p>
                <p className="text-3xl font-bold text-primary">
                    {age.years} <span className="text-xl font-medium">years</span>, {age.months} <span className="text-xl font-medium">months</span>, {age.days} <span className="text-xl font-medium">days</span>
                </p>
            </div>
            {nextBirthday && (
                 <div>
                    <p className="text-muted-foreground">Next Birthday In</p>
                    <p className="text-2xl font-bold text-primary">
                        {nextBirthday.months} <span className="text-lg font-medium">months</span> & {nextBirthday.days} <span className="text-lg font-medium">days</span>
                    </p>
                </div>
            )}
          </div>
        )}
        
        <Button onClick={calculateAge} className="w-full h-12 text-lg font-bold text-white" style={{ backgroundColor: '#8E44AD' }}>
            Calculate Age
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgeCalculator;

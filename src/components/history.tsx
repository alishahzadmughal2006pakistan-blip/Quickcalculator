'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';

type HistoryProps = {
  history: string[];
  onClear: () => void;
};

const History = ({ history, onClear }: HistoryProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <ScrollArea className="h-64">
          <CardContent className="p-4">
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">No calculations yet.</p>
            ) : (
              <div className="flex flex-col gap-3 font-code">
                {history.map((calc, index) => (
                  <div key={index}>
                    <p className="text-muted-foreground text-right">{calc.split('=')[0]}=</p>
                    <p className="text-xl text-foreground font-bold text-right">{calc.split('=')[1]}</p>
                    {index < history.length -1 && <Separator className="mt-3"/>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
      <Button
        variant="destructive"
        onClick={onClear}
        disabled={history.length === 0}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Clear History
      </Button>
    </div>
  );
};

export default History;

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getUnitConversion } from '@/app/actions';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  query: z.string().min(3, "Please enter a conversion query, e.g., '100m to feet'."),
});

const UnitConverter = () => {
  const { toast } = useToast();
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getUnitConversion({ conversionQuery: values.query });
      if (response.success && response.data) {
        setResult(response.data.result);
      } else {
        toast({
          variant: 'destructive',
          title: 'Conversion Error',
          description: response.error || 'An unknown error occurred.',
        });
      }
    } catch (error) {
       toast({
          variant: 'destructive',
          title: 'Submission Error',
          description: 'Could not connect to the conversion service.',
        });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conversion Query</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., convert 100 USD to EUR"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Convert'}
          </Button>
        </form>
      </Form>
      {(isLoading || result) && (
        <Card className="mt-4">
          <CardContent className="p-6">
            {isLoading && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {result && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Result:</h3>
                <p className="text-primary font-bold text-2xl">{result}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnitConverter;

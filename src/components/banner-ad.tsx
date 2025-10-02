
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/use-settings';

export const BannerAd = () => {
    const { setPremium } = useSettings();

    // TODO: GOOGLE ADMOB INTEGRATION
    // This is where you would render the real Google AdMob banner ad component.
    // For now, we are showing a promotional card to upgrade to premium.
    
    return (
        <Card className="w-full bg-primary/10 border-primary/20">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-semibold text-primary">Upgrade to Premium</h3>
                    <p className="text-sm text-primary/80">Remove ads and unlock all features!</p>
                </div>
                <Button onClick={() => setPremium(true)} size="sm">Upgrade</Button>
            </CardContent>
        </Card>
    );
}

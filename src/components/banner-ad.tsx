
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/use-settings';

export const BannerAd = () => {
    const { setPremium } = useSettings();

    // =========================================================================
    // TODO: GOOGLE ADMOB INTEGRATION - BANNER AD
    // =========================================================================
    // 1. Import the banner ad component from your AdMob library.
    // 2. Replace the entire <Card> component below with the real AdMob banner ad component.
    //    For example: <AdMobBannerAd unitId="YOUR_BANNER_AD_UNIT_ID" />
    // 3. The banner should only be rendered if the user is NOT premium, which is already
    //    handled by the logic in `src/app/page.tsx`.

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

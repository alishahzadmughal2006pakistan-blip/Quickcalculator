'use client';

import { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Video } from 'lucide-react';
import { AdPlayer } from '@/components/ad-player';

interface FeatureLockProps {
    featureKey: string;
    featureName: string;
    children: React.ReactNode;
}

export const FeatureLock = ({ featureKey, featureName, children }: FeatureLockProps) => {
    const { isPremium, unlockedFeatures, unlockFeature } = useSettings();
    const [showAd, setShowAd] = useState(false);
    
    const isUnlocked = isPremium || unlockedFeatures.includes(featureKey);

    const handleAdComplete = () => {
        unlockFeature(featureKey);
        setShowAd(false);
    };
    
    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <>
            <AdPlayer
                isOpen={showAd}
                onClose={() => setShowAd(false)}
                onComplete={handleAdComplete}
                featureName={featureName}
            />
            <Card className="w-full shadow-lg rounded-2xl border-dashed border-2">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-center">{featureName}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
                    <Lock className="w-16 h-16 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">This is a Premium Feature</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                        Upgrade to Premium to get permanent access, or watch a short ad to unlock it for this session.
                    </p>
                    <Button onClick={() => setShowAd(true)} className="w-full max-w-xs">
                        <Video className="mr-2 h-4 w-4" />
                        Watch Ad to Unlock
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}

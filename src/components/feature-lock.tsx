'use client';

import { useState, useTransition } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, Lock, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeatureLockProps {
    featureKey: string;
    featureName: string;
    children: React.ReactNode;
}

export const FeatureLock = ({ featureKey, featureName, children }: FeatureLockProps) => {
    const { isPremium, unlockedFeatures, unlockFeature } = useSettings();
    const [isUnlocking, setIsUnlocking] = useState(false);
    const { toast } = useToast();
    
    const isUnlocked = isPremium || unlockedFeatures.includes(featureKey);

    const handleUnlock = () => {
        setIsUnlocking(true);
        // Simulate watching an ad
        setTimeout(() => {
            unlockFeature(featureKey);
            setIsUnlocking(false);
            toast({
                title: `${featureName} Unlocked!`,
                description: "You can now use this feature for the rest of your session.",
            })
        }, 2000);
    }
    
    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
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
                <Button onClick={handleUnlock} disabled={isUnlocking} className="w-full max-w-xs">
                    {isUnlocking ? <Loader className="animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                    {isUnlocking ? 'Unlocking...' : 'Watch Ad to Unlock'}
                </Button>
            </CardContent>
        </Card>
    );
}

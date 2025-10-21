
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AdPlayerProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    featureName: string;
}

declare global {
    interface Window {
        Android?: {
          showRewardedAd: () => void;
        }
    }
}


const AD_DURATION = 5; // Fallback duration in seconds if native bridge fails

export const AdPlayer = ({ isOpen, onClose, onComplete, featureName }: AdPlayerProps) => {
    const [countdown, setCountdown] = useState(AD_DURATION);
    const [progress, setProgress] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        if (!isOpen) {
            setCountdown(AD_DURATION);
            setProgress(0);
            return;
        }

        // =========================================================================
        // ANDROID NATIVE INTEGRATION: REWARDED AD
        // =========================================================================
        // 1. This effect is triggered when the ad dialog opens.
        // 2. We call `window.Android.showRewardedAd()` to ask the native Android
        //    app to display a rewarded advertisement.
        // 3. The native app is responsible for loading and showing the ad.
        // 4. When the user successfully watches the ad, the native app MUST call
        //    the `window.dispatchEvent(new Event('rewardedAdCompleted'))`
        //    JavaScript event to notify this web app.
        // 5. If the ad fails (e.g., user is offline), the native app should call
        //    `window.dispatchEvent(new Event('rewardedAdFailed'))`.
        // 6. If the ad is dismissed early, call `rewardedAdDismissed`.
        
        if (window.Android && typeof window.Android.showRewardedAd === 'function') {
            window.Android.showRewardedAd();
        } else {
            console.warn("Android interface for Rewarded Ad not found. Using fallback timer.");
            // Fallback timer for web/testing environments
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        onComplete();
                        toast({
                            title: `${featureName} Unlocked!`,
                            description: "You can now use this feature for the rest of your session.",
                        });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(countdownInterval);
        }

    }, [isOpen, onComplete, featureName, toast]);

    useEffect(() => {
        const handleAdCompleted = () => {
            console.log("Rewarded ad completed. Granting reward.");
            onComplete();
            toast({
                title: `${featureName} Unlocked!`,
                description: "You can now use this feature for the rest of your session.",
            });
        };

        const handleAdDismissed = () => {
            console.log("Rewarded ad dismissed.");
            onClose();
        };

        const handleAdFailed = () => {
            console.log("Rewarded ad failed to load.");
            toast({
                variant: "destructive",
                title: "Ad Not Available",
                description: "Could not load ad. Please check your internet connection.",
            });
            onClose();
        };

        window.addEventListener('rewardedAdCompleted', handleAdCompleted);
        window.addEventListener('rewardedAdDismissed', handleAdDismissed);
        window.addEventListener('rewardedAdFailed', handleAdFailed);

        return () => {
            window.removeEventListener('rewardedAdCompleted', handleAdCompleted);
            window.removeEventListener('rewardedAdDismissed', handleAdDismissed);
            window.removeEventListener('rewardedAdFailed', handleAdFailed);
        };
    }, [onComplete, onClose, featureName, toast]);


    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Unlock with an Ad</DialogTitle>
                    <DialogDescription>
                       An ad is being loaded. Your feature will be available after the ad finishes.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="aspect-video bg-black text-white flex flex-col items-center justify-center rounded-lg my-4 space-y-2">
                    <p>Loading advertisement...</p>
                    <p className="text-xs text-muted-foreground">(This dialog will close once the ad is ready)</p>
                </div>

                <DialogFooter className="sm:justify-end items-center">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

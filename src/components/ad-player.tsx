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

const AD_DURATION = 5; // Ad duration in seconds

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

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + (100 / (AD_DURATION * 10)); // Update every 100ms
                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return newProgress;
            });
        }, 100);

        return () => {
            clearInterval(countdownInterval);
            clearInterval(progressInterval);
        };
    }, [isOpen, onComplete, featureName, toast]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Unlock Feature by Watching an Ad</DialogTitle>
                    <DialogDescription>
                        Your feature will be available after the ad finishes.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="aspect-video bg-black text-white flex items-center justify-center rounded-lg my-4">
                    <p>Your ad is playing...</p>
                </div>

                <DialogFooter className="sm:justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Ad finishes in {countdown}s...
                    </p>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogFooter>
                <Progress value={progress} className="w-full h-2 absolute bottom-0 left-0 rounded-none" />
            </DialogContent>
        </Dialog>
    );
};

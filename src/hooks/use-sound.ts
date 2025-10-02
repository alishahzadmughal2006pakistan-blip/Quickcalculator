'use client';

import { useSettings } from './use-settings';
import { useCallback, useMemo } from 'react';

export const useSound = (soundFile: string) => {
    const { soundEnabled } = useSettings();
    
    const audio = useMemo(() => {
        if (typeof Audio !== "undefined") {
            return new Audio(soundFile);
        }
        return undefined;
    }, [soundFile]);

    const play = useCallback(() => {
        if (soundEnabled && audio) {
            audio.currentTime = 0;
            audio.play().catch(error => {
                // Autoplay was prevented.
                console.log("Sound play failed", error);
            });
        }
    }, [soundEnabled, audio]);

    return play;
};

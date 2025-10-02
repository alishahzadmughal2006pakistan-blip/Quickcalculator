'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SettingsContextType {
    isPremium: boolean;
    soundEnabled: boolean;
    unlockedFeatures: string[];
    pinnedCalculators: string[];
    setPremium: (isPremium: boolean) => void;
    toggleSound: () => void;
    unlockFeature: (featureKey: string) => void;
    togglePinnedCalculator: (calculatorKey: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

interface SettingsProviderProps {
    children: React.ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const [isPremium, setIsPremium] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [unlockedFeatures, setUnlockedFeatures] = useState<string[]>([]);
    const [pinnedCalculators, setPinnedCalculators] = useState<string[]>(['home']);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const premiumStatus = localStorage.getItem('isPremium');
            const soundStatus = localStorage.getItem('soundEnabled');
            const pinned = localStorage.getItem('pinnedCalculators');
            
            if (premiumStatus) setIsPremium(JSON.parse(premiumStatus));
            if (soundStatus) setSoundEnabled(JSON.parse(soundStatus));
            if (pinned) {
                const parsedPinned = JSON.parse(pinned);
                if (Array.isArray(parsedPinned)) {
                    if (!parsedPinned.includes('home')) {
                        parsedPinned.unshift('home');
                    }
                    setPinnedCalculators(parsedPinned);
                } else {
                    setPinnedCalculators(['home']);
                }
            } else {
                 setPinnedCalculators(['home']);
            }

        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
            // Reset to defaults on error
            setPinnedCalculators(['home']);
        }
        setIsLoaded(true);
    }, []);

    const setPremium = (premium: boolean) => {
        try {
            localStorage.setItem('isPremium', JSON.stringify(premium));
            setIsPremium(premium);
        } catch (error) {
            console.error("Failed to save premium status to localStorage", error);
        }
    }
    
    const toggleSound = () => {
        try {
            const newSoundState = !soundEnabled;
            localStorage.setItem('soundEnabled', JSON.stringify(newSoundState));
            setSoundEnabled(newSoundState);
        } catch (error) {
            console.error("Failed to save sound status to localStorage", error);
        }
    };
    
    const unlockFeature = (featureKey: string) => {
        if (!unlockedFeatures.includes(featureKey)) {
            setUnlockedFeatures(prev => [...prev, featureKey]);
        }
    }
    
    const togglePinnedCalculator = (calculatorKey: string) => {
        if (calculatorKey === 'home') return;
        
        try {
            let newPinned: string[];
            if (pinnedCalculators.includes(calculatorKey)) {
                newPinned = pinnedCalculators.filter(key => key !== calculatorKey);
            } else {
                newPinned = [...pinnedCalculators, calculatorKey];
            }
            localStorage.setItem('pinnedCalculators', JSON.stringify(newPinned));
            setPinnedCalculators(newPinned);
        } catch (error) {
            console.error("Failed to save pinned calculators to localStorage", error);
        }
    };
    
    const value = {
        isPremium,
        soundEnabled,
        unlockedFeatures,
        pinnedCalculators,
        setPremium,
        toggleSound,
        unlockFeature,
        togglePinnedCalculator
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
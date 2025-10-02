import { Atom } from 'lucide-react';

const SplashScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen w-screen bg-background">
    <div className="flex items-center space-x-4 animate-fade-in animate-pulse">
      <Atom className="w-16 h-16 text-primary" />
      <h1 className="text-5xl font-bold text-primary">Quick Calculator+</h1>
    </div>
  </div>
);

export default SplashScreen;

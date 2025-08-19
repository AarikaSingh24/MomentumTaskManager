'use client';

import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AllTasksCompletedProps {
    showConfetti: boolean;
    onAnimationComplete: () => void;
}

const AllTasksCompleted: React.FC<AllTasksCompletedProps> = ({ showConfetti, onAnimationComplete }) => {
  const { width, height } = useWindowSize();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering on the server
  }

  return (
    <div className={cn(
        "text-center py-10 px-4 border-2 border-dashed border-secondary rounded-lg flex flex-col items-center justify-center h-48 transition-all duration-500",
        showConfetti ? 'animate-fade-in-up' : ''
    )}>
        {showConfetti && (
            <ReactConfetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.1}
                onConfettiComplete={onAnimationComplete}
            />
        )}
        <div className="relative">
            <CheckCircle2 className={cn(
                "mx-auto h-12 w-12 text-primary transition-all duration-700 ease-in-out",
                showConfetti ? 'scale-110 -translate-y-2' : ''
            )} />
             <div className={cn(
                "absolute -inset-2 rounded-full bg-primary/20 blur-xl transition-all duration-700",
                showConfetti ? 'opacity-100' : 'opacity-0'
            )}></div>
        </div>
        <h3 className="mt-4 text-lg font-medium">All tasks completed!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
            You have no pending tasks. Great job!
        </p>
    </div>
  );
};

export default AllTasksCompleted;

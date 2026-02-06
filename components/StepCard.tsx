import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Pause, RotateCcw, Hourglass } from 'lucide-react';
import { RecipeStep, Language } from '../types';

interface StepCardProps {
  step: RecipeStep;
  index: number;
  lang: Language;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index, lang }) => {
  const [completed, setCompleted] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(step.timeInSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Strict check: Only show timer if timeInSeconds is positive
  const hasTimer = step.timeInSeconds > 0;
  
  const progress = ((step.timeInSeconds - timeLeft) / step.timeInSeconds) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
             setIsRunning(false);
             if (timerRef.current) clearInterval(timerRef.current);
             return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeLeft === 0) return;
    setIsRunning(!isRunning);
  };

  const resetTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(false);
    setTimeLeft(step.timeInSeconds);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const t = {
    done: lang === 'zh' ? "完成" : "DONE",
    reset: lang === 'zh' ? "重置" : "Reset"
  };

  return (
    <div 
      onClick={() => setCompleted(!completed)}
      className={`
        relative overflow-hidden rounded-lg border-2 transition-all duration-300 cursor-pointer group select-none
        ${completed 
          ? 'bg-stone-200/50 border-stone-300 opacity-60' 
          : 'bg-[#FFFBF0] border-[#8B7355] hover:border-[#D97706] shadow-[4px_4px_0px_rgba(67,52,34,0.1)] hover:shadow-[4px_4px_0px_rgba(217,119,6,0.2)] hover:-translate-y-0.5'
        }
      `}
    >
      <div className="p-4 sm:p-5 flex gap-4 items-start">
        {/* Step Number / Checkbox */}
        <div className="mt-1 shrink-0">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-300
            ${completed 
              ? 'bg-[#65A30D] border-[#65A30D] text-white' 
              : 'bg-[#FDF6E3] border-[#8B7355] text-[#8B7355] group-hover:border-[#D97706] group-hover:text-[#D97706]'
            }
          `}>
            {completed ? <Check size={16} strokeWidth={4} /> : index + 1}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-[16px] leading-relaxed font-bold serif transition-colors duration-300 ${completed ? 'text-stone-400 line-through' : 'text-[#433422]'}`}>
            {step.instruction}
          </p>

          {/* RPG Style Timer - Only rendered if hasTimer is true */}
          {hasTimer && !completed && (
            <div className="mt-4 inline-flex items-center gap-0 bg-[#433422] p-1 rounded-lg shadow-lg">
              {/* Timer Display */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2A2318] rounded-md border border-[#5C4830]">
                {timeLeft === 0 ? <Check size={16} className="text-[#65A30D]"/> : <Hourglass size={16} className={isRunning ? "text-[#D97706] animate-pulse" : "text-stone-400"} />}
                <span className={`font-mono font-bold text-sm tracking-widest ${timeLeft === 0 ? 'text-[#65A30D]' : 'text-[#FDF6E3]'}`}>
                  {timeLeft === 0 ? t.done : formatTime(timeLeft)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center px-1">
                {timeLeft > 0 && (
                  <button 
                    onClick={toggleTimer}
                    className="p-2 text-[#FDF6E3] hover:text-[#D97706] active:scale-90 transition-all"
                  >
                    {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                )}

                {timeLeft < step.timeInSeconds && (
                   <button 
                   onClick={resetTimer}
                   className="p-2 text-stone-500 hover:text-white active:scale-90 transition-all"
                   title={t.reset}
                 >
                   <RotateCcw size={16} />
                 </button>
                )}
              </div>
              
              {/* Mini Progress Bar inside the timer container */}
              {timeLeft > 0 && timeLeft < step.timeInSeconds && (
                <div className="absolute bottom-0 left-0 h-1 bg-[#D97706]" style={{ width: `${progress}%`, transition: 'width 1s linear' }}></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
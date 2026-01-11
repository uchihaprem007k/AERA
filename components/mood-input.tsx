"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Meh } from "lucide-react";

interface MoodInputProps {
  value: number;
  onChange: (value: number) => void;
  onNoteChange?: (note: string) => void;
  note?: string;
  date?: string;
  showEmotions?: boolean;
}

const emotionTags = [
  { label: "Calm", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { label: "Happy", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  { label: "Anxious", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  { label: "Tired", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  { label: "Excited", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { label: "Sad", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { label: "Grateful", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  { label: "Stressed", color: "bg-red-500/10 text-red-500 border-red-500/20" },
];

export function MoodInput({ value, onChange, onNoteChange, note = "", date, showEmotions = true }: MoodInputProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [localNote, setLocalNote] = useState(note);
  const sliderRef = useRef<HTMLInputElement>(null);

  const getMoodIcon = (mood: number) => {
    if (mood >= 70) return <Smile className="w-6 h-6" />;
    if (mood >= 40) return <Meh className="w-6 h-6" />;
    return <Frown className="w-6 h-6" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 70) return "text-green-500";
    if (mood >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const toggleEmotion = (emotion: string) => {
    const newEmotions = selectedEmotions.includes(emotion)
      ? selectedEmotions.filter((e) => e !== emotion)
      : [...selectedEmotions, emotion];
    setSelectedEmotions(newEmotions);
  };

  const handleNoteChange = (newNote: string) => {
    setLocalNote(newNote);
    onNoteChange?.(newNote);
  };

  const stopPropagation = (e: React.MouseEvent | React.TouchEvent | React.ChangeEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div 
      className="space-y-6"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Mood Slider */}
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium">How are you feeling?</label>
          <div className="flex items-center gap-2">
            {getMoodIcon(value)}
            <span className={`text-2xl font-bold ${getMoodColor(value)}`}>{value}</span>
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="relative"
        >
          <input
            ref={sliderRef}
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => {
              e.stopPropagation();
              onChange(parseInt(e.target.value));
            }}
            onInput={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onMouseMove={(e) => {
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
            className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary relative z-10"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${value}%, hsl(var(--muted)) ${value}%, hsl(var(--muted)) 100%)`,
              pointerEvents: "auto",
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Very Low</span>
          <span>Neutral</span>
          <span>Very High</span>
        </div>
      </div>

      {/* Emotion Tags */}
      {showEmotions && (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <label className="text-sm font-medium mb-3 block">How would you describe this feeling?</label>
          <div className="flex flex-wrap gap-2">
            {emotionTags.map((emotion) => (
              <motion.button
                key={emotion.label}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleEmotion(emotion.label);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  selectedEmotions.includes(emotion.label)
                    ? `${emotion.color} border-current`
                    : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {emotion.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <label className="text-sm font-medium mb-2 block">Want to add a note? (Optional)</label>
        <textarea
          value={localNote}
          onChange={(e) => {
            e.stopPropagation();
            handleNoteChange(e.target.value);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onFocus={(e) => {
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          placeholder="What's contributing to how you feel today?"
          className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
        />
      </div>

      {date && (
        <p className="text-xs text-muted-foreground">Recording for {new Date(date).toLocaleDateString()}</p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Brain, Heart, Activity, AlertCircle } from "lucide-react";
import { lifeSituations } from "@/lib/mock-data";

const mentalStates = [
  {
    id: "burnout",
    title: "Burnout",
    icon: Activity,
    color: "text-orange-500",
    description: "A state of emotional, physical, and mental exhaustion caused by prolonged stress.",
    explanation: "Burnout isn't just being tired—it's a state where you feel emotionally drained, detached from your work or life, and ineffective. It happens when demands consistently exceed your capacity to recover. It's not a personal failing; it's a signal that your system needs rest and support.",
    signs: [
      "Feeling exhausted even after rest",
      "Cynicism or detachment from work/life",
      "Reduced sense of accomplishment",
      "Difficulty concentrating",
      "Physical symptoms (headaches, sleep issues)",
    ],
    notDiagnosis: "Burnout is a state of exhaustion, not a medical diagnosis. It's your body's way of saying you need more support.",
    helpful: [
      "Prioritize rest as non-negotiable",
      "Set clear boundaries around work and commitments",
      "Identify what you can delegate or eliminate",
      "Seek support from others",
      "Remember: rest is productive",
    ],
  },
  {
    id: "anxiety-vs-stress",
    title: "Anxiety vs Stress",
    icon: AlertCircle,
    color: "text-yellow-500",
    description: "Understanding the difference between normal stress and anxiety.",
    explanation: "Stress is a response to external pressures (deadlines, responsibilities, life changes). It's usually temporary and tied to specific situations. Anxiety is worry or fear that persists even when the stressor is gone. It's often about future events or things that might happen. Both are normal human experiences, but understanding the difference helps you respond appropriately.",
    signs: {
      stress: [
        "Tied to specific situations",
        "Goes away when the situation resolves",
        "Motivates action",
        "Physical tension",
      ],
      anxiety: [
        "Persistent worry",
        "Not tied to immediate threats",
        "Can feel overwhelming",
        "Physical symptoms (racing heart, restlessness)",
      ],
    },
    notDiagnosis: "Both stress and anxiety are normal responses. If they're interfering significantly with daily life, consider talking to a professional.",
    helpful: [
      "For stress: Address the source, break tasks into steps, ask for help",
      "For anxiety: Grounding techniques, breathing exercises, challenge anxious thoughts",
      "Both: Regular sleep, movement, and social connection help",
    ],
  },
  {
    id: "emotional-numbness",
    title: "Emotional Numbness",
    icon: Heart,
    color: "text-gray-500",
    description: "Feeling disconnected from your emotions or unable to feel much.",
    explanation: "Emotional numbness is a protective response. When emotions become too overwhelming, your system can shut down to protect you. It's not that you don't care—it's that you're protecting yourself from feeling too much. This can happen after trauma, prolonged stress, or when you're overwhelmed. It's temporary and can be worked through with support.",
    signs: [
      "Feeling disconnected from emotions",
      "Difficulty feeling joy or sadness",
      "Feeling 'flat' or empty",
      "Reduced interest in activities",
      "Feeling like you're going through motions",
    ],
    notDiagnosis: "Emotional numbness is a protective mechanism, not a character flaw. It's your system trying to keep you safe.",
    helpful: [
      "Be gentle with yourself—this is protective, not permanent",
      "Start with small emotional experiences",
      "Consider talking to someone you trust",
      "Practice self-compassion",
      "Give yourself time—emotions will return",
    ],
  },
  {
    id: "overthinking",
    title: "Overthinking",
    icon: Brain,
    color: "text-blue-500",
    description: "Getting stuck in repetitive, unproductive thoughts.",
    explanation: "Overthinking is your brain's attempt to solve problems or avoid discomfort. It feels productive because you're 'working on it,' but it usually just creates more anxiety. The brain is trying to protect you by anticipating problems, but it can get stuck in loops. It's not a sign of weakness—it's a pattern that can be changed with practice.",
    signs: [
      "Repetitive thoughts about the same problem",
      "Difficulty making decisions",
      "Ruminating on past events",
      "Worrying about future scenarios",
      "Feeling mentally exhausted",
    ],
    notDiagnosis: "Overthinking is a common pattern, not a disorder. Most people experience it, especially during times of uncertainty or stress.",
    helpful: [
      "Set a 'worry time' to contain overthinking",
      "Practice grounding techniques (5-4-3-2-1 method)",
      "Write thoughts down to externalize them",
      "Ask: 'Is this thought helpful or just repetitive?'",
      "Focus on what you can control, not what you can't",
    ],
  },
];

export default function EducationPage() {
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);

  const StateCard = ({ state }: { state: typeof mentalStates[0] }) => {
    const isExpanded = expandedState === state.id;
    const Icon = state.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setExpandedState(isExpanded ? null : state.id)}
        className="bg-card border border-border rounded-xl p-6 cursor-pointer shadow-md hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Icon className={`w-6 h-6 ${state.color} mt-1 flex-shrink-0`} />
            <div className="flex-1">
              <h4 className="font-semibold mb-2 text-lg">{state.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{state.description}</p>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border space-y-4"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {state.explanation}
                      </p>
                    </div>

                    {"signs" in state && Array.isArray(state.signs) && (
                      <div>
                        <p className="text-sm font-medium mb-2">Common Signs:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {state.signs.map((sign, index) => (
                            <li key={index}>{sign}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {"signs" in state && typeof state.signs === "object" && !Array.isArray(state.signs) && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Stress Signs:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {state.signs.stress.map((sign, index) => (
                              <li key={index}>{sign}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Anxiety Signs:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {state.signs.anxiety.map((sign, index) => (
                              <li key={index}>{sign}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="bg-primary/10 border-l-4 border-primary p-3 rounded-r-lg">
                      <p className="text-sm font-medium text-primary mb-1">Important:</p>
                      <p className="text-sm text-muted-foreground">{state.notDiagnosis}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">What Can Help:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {state.helpful.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="ml-2 flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Understanding Mental States
        </h1>
        <p className="text-muted-foreground">
          Calm, clear explanations of common mental health experiences—no diagnosis, just understanding
        </p>
      </motion.div>

      {/* Mental States */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Common Mental States
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mentalStates.map((state) => (
            <StateCard key={state.id} state={state} />
          ))}
        </div>
      </div>

      {/* Life Situations */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Life Situations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lifeSituations.map((situation) => {
            const isExpanded = selectedSituation === situation.id;
            return (
              <motion.div
                key={situation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedSituation(isExpanded ? null : situation.id)}
                className="bg-card border border-border rounded-xl p-6 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{situation.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{situation.description}</p>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-3 border-t border-border"
                        >
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Explanation:</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{situation.explanation}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Commonality:</p>
                            <p className="text-sm text-muted-foreground">{situation.commonality}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">What Can Help:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {situation.helpful.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6"
      >
        <div className="flex items-start gap-3">
          <BookOpen className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">About This Section</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This section provides educational information to help you understand common mental health experiences. 
              It's not medical advice, diagnosis, or treatment. If you're struggling significantly, consider talking 
              to a mental health professional. Understanding what you're experiencing can be the first step toward 
              feeling better, but it's not a substitute for professional support when needed.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


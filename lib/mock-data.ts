import { subDays, format, startOfDay } from "date-fns";

// Generate 12 months of rich mock data
const now = new Date();
const daysAgo = (days: number) => subDays(now, days);

// Mood data (0-100 scale)
export const generateMoodData = () => {
  const data = [];
  for (let i = 365; i >= 0; i--) {
    const date = daysAgo(i);
    // Create realistic mood patterns with some variation
    const baseMood = 60 + Math.sin(i / 30) * 15 + Math.random() * 20;
    data.push({
      date: format(date, "yyyy-MM-dd"),
      value: Math.max(0, Math.min(100, Math.round(baseMood))),
      note: i % 7 === 0 ? `Day ${i}: Feeling ${baseMood > 70 ? "good" : baseMood > 50 ? "okay" : "low"}` : null,
    });
  }
  return data;
};

// Energy data (0-100 scale)
export const generateEnergyData = () => {
  const data = [];
  for (let i = 365; i >= 0; i--) {
    const date = daysAgo(i);
    const hour = date.getHours();
    // Energy peaks in morning, dips in afternoon
    const baseEnergy = 50 + (hour < 12 ? 30 : hour < 18 ? 10 : -10) + Math.random() * 20;
    data.push({
      date: format(date, "yyyy-MM-dd"),
      hour,
      value: Math.max(0, Math.min(100, Math.round(baseEnergy))),
    });
  }
  return data;
};

// Burnout indicators
export const generateBurnoutData = () => {
  const data = [];
  for (let i = 90; i >= 0; i--) {
    const date = daysAgo(i);
    const risk = 20 + Math.sin(i / 14) * 15 + Math.random() * 10;
    data.push({
      date: format(date, "yyyy-MM-dd"),
      risk: Math.max(0, Math.min(100, Math.round(risk))),
      factors: [
        { name: "Workload", value: Math.round(30 + Math.random() * 40) },
        { name: "Stress", value: Math.round(25 + Math.random() * 35) },
        { name: "Recovery", value: Math.round(40 + Math.random() * 30) },
      ],
    });
  }
  return data;
};

// Tasks
export const generateTasks = () => {
  const tasks = [];
  const categories = ["Work", "Personal", "Health", "Learning", "Social"];
  const statuses = ["pending", "in-progress", "completed"] as const;
  
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = subDays(now, daysAgo);
    tasks.push({
      id: `task-${i}`,
      title: `Task ${i + 1}: ${categories[Math.floor(Math.random() * categories.length)]} task`,
      description: `This is a detailed description of task ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: Math.floor(Math.random() * 3) + 1,
      dueDate: format(date, "yyyy-MM-dd"),
      completedAt: Math.random() > 0.5 ? format(date, "yyyy-MM-dd") : null,
    });
  }
  return tasks;
};

// Focus sessions
export const generateFocusSessions = () => {
  const sessions = [];
  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const date = subDays(now, daysAgo);
    sessions.push({
      id: `session-${i}`,
      date: format(date, "yyyy-MM-dd"),
      duration: Math.floor(Math.random() * 120) + 15, // 15-135 minutes
      focusScore: Math.floor(Math.random() * 40) + 60, // 60-100
      task: `Focus session on ${["work", "study", "creative", "planning"][Math.floor(Math.random() * 4)]}`,
    });
  }
  return sessions;
};

// Reflections
export const generateReflections = () => {
  const reflections = [];
  const prompts = [
    "What am I grateful for today?",
    "What challenged me today?",
    "What did I learn about myself?",
    "How did I handle stress today?",
    "What brought me joy?",
  ];
  
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = subDays(now, daysAgo);
    reflections.push({
      id: `reflection-${i}`,
      date: format(date, "yyyy-MM-dd"),
      prompt: prompts[Math.floor(Math.random() * prompts.length)],
      response: `This is a reflection entry from ${format(date, "MMM d, yyyy")}. I've been thinking about various aspects of my life and how they're evolving.`,
      mood: Math.floor(Math.random() * 40) + 50,
    });
  }
  return reflections;
};

// Life situations
export const lifeSituations = [
  {
    id: "work-pressure",
    title: "Work Pressure",
    description: "Feeling overwhelmed by deadlines and expectations at work.",
    explanation: "Work pressure is common when responsibilities accumulate faster than your capacity to handle them. It often stems from unclear priorities, perfectionism, or difficulty saying no.",
    commonality: "Very common",
    helpful: [
      "Break tasks into smaller steps",
      "Communicate boundaries clearly",
      "Prioritize based on impact, not urgency",
      "Schedule regular breaks",
    ],
    category: "Work",
  },
  {
    id: "relationship-strain",
    title: "Relationship Strain",
    description: "Tension or conflict in personal relationships.",
    explanation: "Relationship strain happens when communication breaks down or needs aren't being met. It's normal in any close relationship and often indicates a need for clearer boundaries or more honest conversation.",
    commonality: "Very common",
    helpful: [
      "Express needs without blame",
      "Listen actively to understand, not just respond",
      "Take space when emotions are high",
      "Seek to understand before being understood",
    ],
    category: "Relationships",
  },
  {
    id: "financial-worry",
    title: "Financial Worry",
    description: "Anxiety about money, expenses, or financial security.",
    explanation: "Financial worry is extremely common and often more about uncertainty than actual scarcity. It can trigger our survival instincts even when we're not in immediate danger.",
    commonality: "Very common",
    helpful: [
      "Create a clear picture of your finances",
      "Build a small emergency fund gradually",
      "Focus on what you can control",
      "Remember that your worth isn't tied to your wealth",
    ],
    category: "Life",
  },
  {
    id: "identity-questioning",
    title: "Questioning Your Identity",
    description: "Uncertainty about who you are, what you want, or where you're going.",
    explanation: "Identity questioning is a natural part of growth, especially during transitions. It shows you're evolving rather than staying stuck. Many people experience this multiple times throughout life.",
    commonality: "Common",
    helpful: [
      "Allow yourself to explore without pressure",
      "Notice what energizes you vs. what drains you",
      "Your identity can be fluid and multifaceted",
      "You don't need to have everything figured out",
    ],
    category: "Personal Growth",
  },
  {
    id: "social-comparison",
    title: "Social Comparison",
    description: "Comparing yourself to others and feeling inadequate.",
    explanation: "Social comparison is a natural human tendency, amplified by social media. We compare our behind-the-scenes to others' highlight reels, which creates an unfair and unrealistic standard.",
    commonality: "Very common",
    helpful: [
      "Limit social media consumption",
      "Remember everyone has struggles you don't see",
      "Focus on your own progress, not others'",
      "Curate your feed to include realistic content",
    ],
    category: "Mental Health",
  },
  {
    id: "procrastination",
    title: "Procrastination",
    description: "Putting off important tasks despite knowing you should do them.",
    explanation: "Procrastination is often about emotion regulation, not laziness. We delay tasks that feel overwhelming, boring, or anxiety-provoking. Understanding the underlying emotion helps address it.",
    commonality: "Very common",
    helpful: [
      "Start with the smallest possible step",
      "Address the emotion, not just the task",
      "Use time-blocking to create structure",
      "Reward yourself for starting, not just finishing",
    ],
    category: "Productivity",
  },
  {
    id: "loneliness",
    title: "Loneliness",
    description: "Feeling disconnected from others, even when surrounded by people.",
    explanation: "Loneliness is about the quality of connection, not quantity. You can feel lonely in a crowd if the connections lack depth or authenticity. It's a signal that your need for meaningful connection isn't being met.",
    commonality: "Very common",
    helpful: [
      "Seek quality connections over quantity",
      "Be vulnerable with safe people",
      "Join communities around your interests",
      "Remember that feeling lonely doesn't mean you're unlovable",
    ],
    category: "Social",
  },
  {
    id: "decision-fatigue",
    title: "Decision Fatigue",
    description: "Feeling exhausted from making too many decisions.",
    explanation: "Decision fatigue happens when your mental energy for choices is depleted. The brain uses the same resources for all decisions, big and small, so too many choices can leave you feeling drained.",
    commonality: "Common",
    helpful: [
      "Automate routine decisions (meal prep, outfits)",
      "Batch similar decisions together",
      "Set decision deadlines to avoid overthinking",
      "Accept 'good enough' for low-stakes choices",
    ],
    category: "Mental Load",
  },
  {
    id: "imposter-syndrome",
    title: "Imposter Syndrome",
    description: "Feeling like a fraud despite evidence of competence.",
    explanation: "Imposter syndrome is common among high achievers. It's often a sign that you're operating outside your comfort zone, which is where growth happens. The feeling doesn't reflect reality.",
    commonality: "Very common",
    helpful: [
      "Keep a record of your achievements",
      "Talk to others about your feelings",
      "Reframe self-doubt as a sign of growth",
      "Remember that everyone feels this sometimes",
    ],
    category: "Work",
  },
  {
    id: "perfectionism",
    title: "Perfectionism",
    description: "Setting impossibly high standards and struggling when things aren't perfect.",
    explanation: "Perfectionism is often a defense mechanism against criticism or failure. It can look like high standards, but it's actually about fear. It prevents you from starting, finishing, or feeling satisfied.",
    commonality: "Common",
    helpful: [
      "Set 'good enough' standards",
      "Practice completing things imperfectly",
      "Separate your worth from your output",
      "Notice when perfectionism is protecting you from something",
    ],
    category: "Personal Growth",
  },
  {
    id: "burnout-risk",
    title: "Burnout Risk",
    description: "Feeling emotionally exhausted, detached, and ineffective.",
    explanation: "Burnout is a state of chronic stress that leads to physical and emotional exhaustion. It's not a personal failing—it's a sign that your system is overwhelmed and needs rest and recovery.",
    commonality: "Common",
    helpful: [
      "Prioritize rest as non-negotiable",
      "Set clear boundaries around work",
      "Identify what you can delegate or eliminate",
      "Seek support from others",
    ],
    category: "Mental Health",
  },
  {
    id: "sleep-issues",
    title: "Sleep Issues",
    description: "Difficulty falling asleep, staying asleep, or feeling rested.",
    explanation: "Sleep issues are often connected to stress, anxiety, or lifestyle factors. Poor sleep creates a cycle where you're more stressed, which makes sleep harder, which increases stress.",
    commonality: "Very common",
    helpful: [
      "Create a consistent bedtime routine",
      "Limit screens before bed",
      "Address underlying stress or anxiety",
      "Consider your sleep environment (temperature, light, noise)",
    ],
    category: "Health",
  },
  {
    id: "motivation-loss",
    title: "Loss of Motivation",
    description: "Losing interest in things that used to matter to you.",
    explanation: "Loss of motivation can signal burnout, depression, or simply that your needs or values have shifted. It's important to distinguish between temporary fatigue and a deeper shift in what matters to you.",
    commonality: "Common",
    helpful: [
      "Check in with your values—have they changed?",
      "Break large goals into tiny steps",
      "Address underlying burnout or depression",
      "Allow yourself to rest without guilt",
    ],
    category: "Mental Health",
  },
  {
    id: "overthinking",
    title: "Overthinking",
    description: "Getting stuck in repetitive, unproductive thoughts.",
    explanation: "Overthinking is the mind's attempt to solve problems or avoid discomfort. It feels productive but usually just creates more anxiety. The brain is trying to protect you by anticipating problems.",
    commonality: "Very common",
    helpful: [
      "Set a 'worry time' to contain overthinking",
      "Practice grounding techniques (5-4-3-2-1 method)",
      "Write thoughts down to externalize them",
      "Ask: 'Is this thought helpful or just repetitive?'",
    ],
    category: "Mental Load",
  },
  {
    id: "boundary-difficulty",
    title: "Difficulty Setting Boundaries",
    description: "Struggling to say no or protect your time and energy.",
    explanation: "Boundary difficulty often comes from fear of conflict, rejection, or being seen as selfish. But boundaries are essential for healthy relationships and sustainable energy. They're a form of self-respect.",
    commonality: "Very common",
    helpful: [
      "Start with small boundaries and build up",
      "Remember that 'no' is a complete sentence",
      "Practice in low-stakes situations first",
      "Understand that others' reactions aren't your responsibility",
    ],
    category: "Relationships",
  },
];

// Export all mock data
export const mockData = {
  mood: generateMoodData(),
  energy: generateEnergyData(),
  burnout: generateBurnoutData(),
  tasks: generateTasks(),
  focusSessions: generateFocusSessions(),
  reflections: generateReflections(),
  lifeSituations,
};


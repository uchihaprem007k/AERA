# AERA - Your Personal Intelligence Layer

<div align="center">

![AERA Logo](https://img.shields.io/badge/AERA-Personal%20Intelligence-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A complete mental health operating system for self-understanding and mental wellbeing.**

[Features](#-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [Features Overview](#-features-overview) • [Development](#-development)

</div>

---

## 🌟 Overview

AERA is a comprehensive mental health application designed to help users understand themselves better through data-driven insights, interactive tracking, and psychologically-grounded guidance. Unlike therapy or diagnosis apps, AERA serves as a personal intelligence layer that helps normal people navigate life's complexities with greater self-awareness.

### Core Philosophy

- **Not a therapy app** - AERA doesn't diagnose or treat
- **Not motivational fluff** - Real insights based on your data
- **Psychologically grounded** - Built on sound mental health principles
- **User-driven** - You control your data and insights
- **Calm and intelligent** - No fear, no guilt, just understanding

---

## ✨ Features

### 📊 Dashboard
- **Interactive KPIs** - Click any metric to update it
- **Mixed Data Visualizations** - Pie charts, bar charts, line charts, and area charts
- **Real-time Updates** - Charts update instantly when you enter data
- **Expandable Insights** - Click insights to see detailed explanations
- **Refresh Data** - Regenerate mock data for testing
- **Animated Count-ups** - Smooth number animations for all stats

### 🧠 Self-Awareness
- **Mood Tracking** - Log daily mood with slider (0-100)
- **Emotion Tags** - Select from 8 emotion categories (Calm, Happy, Anxious, etc.)
- **Timeline Visualization** - Interactive 30-day mood timeline
- **Click to Edit** - Click any point on the timeline to edit past entries
- **Stability Index** - Calculated mood consistency metric
- **Reflection Entries** - View and manage your reflection history

### ⚡ Mental Load
- **Cognitive Load Assessment** - Interactive slider to assess mental burden
- **Overthinking Indicators** - Track repetitive thought patterns
- **Pressure Source Checklist** - Select which pressures apply to you
- **Real-time Meter** - Visual load meter updates as you assess
- **Personal Notes** - Add context about what's creating pressure

### 🔋 Energy
- **Daily Energy Tracking** - Log energy levels throughout the day
- **Peak Time Selection** - Identify when you feel most energized
- **Energy Curve Visualization** - See your 24-hour energy patterns
- **Fatigue Factors** - Understand what affects your energy
- **Peak Hours Analysis** - Discover your optimal performance times

### 📅 Planner
- **Full Task Management** - Add, edit, delete, and complete tasks
- **AI Reordering** - Smart task prioritization (mock implementation)
- **Task Categories** - Organize by Work, Personal, Health, Learning, Social
- **Priority Levels** - High, Medium, Low with visual indicators
- **Difficulty & Energy** - Estimate task difficulty and energy requirements
- **Completion Animations** - Satisfying animations when tasks are completed
- **Task Statistics** - Visual breakdowns by status, category, and priority

### 🔥 Burnout
- **Risk Assessment** - Interactive slider to assess burnout risk
- **Warning Acknowledgment** - Mark warnings as acknowledged
- **Recovery Actions** - Log and track recovery steps
- **Contributing Factors** - See what's driving your burnout risk
- **Recovery Suggestions** - Contextual advice based on your risk level
- **Trend Analysis** - Track burnout risk over time

### 💡 Insights
- **AI-Powered Insights** - Data-driven insights about your patterns
- **Mood Stability Analysis** - Understand your emotional consistency
- **Energy Pattern Recognition** - Discover your natural rhythms
- **Task Completion Insights** - Learn about your productivity patterns
- **Burnout Awareness** - Get gentle reminders about stress management

### ❤️ Life Situations
- **15+ Common Struggles** - Explore situations many people face
- **Psychological Explanations** - Understand why things happen
- **"This Applies to Me" Toggle** - Personalize your experience
- **Personal Notes** - Add your own thoughts about each situation
- **Frequency Tracking** - Note how often situations come up
- **Helpful Strategies** - Evidence-based suggestions for each situation

### 👤 Profile
- **30-Day Progress View** - Visual timeline of your mental health journey
- **What Changed Analysis** - See improvements in mood, energy, and burnout
- **Personal Mind Profile** - Stability, Awareness, and Resilience scores
- **Gentle Achievements** - Celebrate your tracking consistency
- **Progress Annotations** - Add notes to significant days

### 🤖 AI Coach
- **Conversational Interface** - Chat with your AI mental health companion
- **Context-Aware Responses** - Answers based on your actual data
- **Suggested Questions** - Quick prompts to explore your data
- **Typing Animation** - Realistic conversation experience
- **Data-Driven Insights** - Get personalized insights about your patterns

### ⚙️ Settings
- **Theme Selection** - Light, Dark, or System preference
- **Notification Preferences** - Customize your reminders
- **Privacy Controls** - Export or delete your data
- **Accessibility Options** - Customize your experience

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uchihaprem007k/AERA.git
   cd AERA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

---

## 🛠 Tech Stack

### Core Framework
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 18](https://react.dev/)** - UI library

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library
- **Custom Design System** - Gradient cards, soft shadows, rounded corners

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
  - `useAppStore` - Theme and app settings
  - `useTaskStore` - Task management
  - `useMoodStore` - Mood tracking
  - `useEnergyStore` - Energy tracking

### Data Visualization
- **[Recharts](https://recharts.org/)** - Charting library
  - Pie charts for distributions
  - Bar charts for comparisons
  - Line charts for trends
  - Area charts for continuous data

### Utilities
- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classnames
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Tailwind class merging

---

## 📁 Project Structure

```
AERA/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Main dashboard with KPIs and charts
│   ├── self-awareness/          # Mood tracking and emotional patterns
│   ├── mental-load/             # Cognitive load assessment
│   ├── energy/                  # Energy level tracking
│   ├── planner/                 # Task management
│   ├── burnout/                 # Burnout risk assessment
│   ├── insights/                # AI-powered insights
│   ├── life-situations/         # Common struggles guide
│   ├── profile/                 # User profile and progress
│   ├── ai-coach/                # AI chat interface
│   ├── settings/                # App settings
│   ├── layout.tsx               # Root layout with sidebar
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
│
├── components/                  # Reusable React components
│   ├── sidebar.tsx              # Navigation sidebar
│   ├── theme-provider.tsx       # Theme management
│   ├── add-task-modal.tsx       # Task creation modal
│   ├── edit-modal.tsx           # Generic edit modal
│   ├── mood-input.tsx           # Mood entry component
│   ├── energy-input.tsx         # Energy entry component
│   └── count-up.tsx             # Animated number component
│
├── lib/                         # Utilities and stores
│   ├── store.ts                 # App settings store
│   ├── task-store.ts            # Task management store
│   ├── mood-store.ts            # Mood tracking store
│   ├── energy-store.ts          # Energy tracking store
│   ├── mock-data.ts             # Mock data generators
│   └── utils.ts                 # Utility functions
│
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind configuration
└── README.md                    # This file
```

---

## 🎨 Features Overview

### Interactive Data Entry

Every metric in AERA can be edited:

- **Mood** - Slider + emotion tags + notes
- **Energy** - Slider + peak time + notes
- **Mental Load** - Assessment scale + checklist + notes
- **Burnout Risk** - Risk slider + acknowledgments + actions
- **Tasks** - Full CRUD operations
- **Life Situations** - Toggle relevance + notes + frequency

### Real-time Updates

- Charts update instantly when data changes
- Statistics recalculate automatically
- Visual feedback on all interactions
- Smooth animations throughout

### Data Visualization

- **Pie Charts** - Task status, mood distribution
- **Bar Charts** - Energy by day, categories, priorities
- **Line Charts** - Burnout trends, mood stability
- **Area Charts** - Mood/energy timelines with gradients

### Mock Data

The app comes with rich mock data:
- 12 months of mood tracking
- Energy patterns by hour
- Burnout risk indicators
- 50+ sample tasks
- 100+ focus sessions
- 60+ reflection entries
- 15+ life situations

All data is generated locally and can be replaced with real data sources.

---

## 🎯 Key Features

### User-Driven Design
- **No Read-Only Dashboards** - Every metric is editable
- **Click to Edit** - KPIs, timeline points, cards
- **Inline Editing** - Quick updates without navigation
- **Modal Forms** - Detailed input when needed

### Psychological Safety
- **Gentle Language** - No diagnosis, no guilt, no fear
- **Normalization** - Common struggles are explained
- **Validation** - Your feelings are acknowledged
- **Empowerment** - You're in control

### Visual Polish
- **Gradient Cards** - Soft, modern aesthetic
- **Smooth Animations** - Framer Motion throughout
- **Count-up Effects** - Numbers animate on load
- **Hover States** - Interactive feedback everywhere
- **Dark Mode** - Full theme support

---

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Consistent code formatting
- Component-based architecture

### State Management

AERA uses Zustand for state management:

```typescript
// Example: Using mood store
import { useMoodStore } from '@/lib/mood-store';

const updateMood = useMoodStore((state) => state.updateMood);
const todayMood = useMoodStore((state) => state.getTodayMood());

// Update today's mood
updateMood('2024-01-11', 75, 'Feeling good today', ['Happy', 'Calm']);
```

---

## 📊 Data Flow

1. **User Input** → Component (MoodInput, EnergyInput, etc.)
2. **Component** → Zustand Store (updateMood, updateEnergy, etc.)
3. **Store** → Page State (reactive updates)
4. **State** → Charts & Visualizations (real-time rendering)

All data persists during the session and can be extended to use localStorage or a backend.

---

## 🎨 Design Principles

### Visual Hierarchy
- Clear typography scale
- Consistent spacing system
- Color-coded metrics
- Icon usage for quick recognition

### Interaction Design
- Hover states on all interactive elements
- Smooth transitions (300ms default)
- Loading states for async operations
- Error states with helpful messages

### Accessibility
- Semantic HTML
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

---

## 🔮 Future Enhancements

Potential features for future versions:

- [ ] Backend integration (database, API)
- [ ] User authentication
- [ ] Data export/import
- [ ] Mobile app (React Native)
- [ ] Advanced AI insights
- [ ] Social features (optional sharing)
- [ ] Customizable dashboards
- [ ] Habit tracking
- [ ] Sleep tracking integration
- [ ] Meditation/breathing exercises

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is built for personal use and mental health support. See the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with care for normal humans navigating life's complexities
- Inspired by principles of self-awareness and mental wellbeing
- Designed to be a safe, non-judgmental space for reflection

---

## 📞 Support

For questions, issues, or feedback:
- Open an issue on [GitHub](https://github.com/uchihaprem007k/AERA/issues)
- Check the documentation in the codebase

---

<div align="center">

**Made with ❤️ for better mental health awareness**

[⭐ Star this repo](https://github.com/uchihaprem007k/AERA) if you find it helpful!

</div>

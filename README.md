# AERA - Your Personal Intelligence Layer

A complete mental health operating system for self-understanding and mental wellbeing.

## Features

- **Dashboard**: Comprehensive overview of your mental health metrics
- **Self-Awareness**: Track mood, emotional patterns, and stability
- **Mental Load**: Monitor cognitive burden and pressure sources
- **Energy**: Understand your energy patterns and peak performance times
- **Planner**: Organize tasks with AI-powered prioritization
- **Burnout**: Track burnout risk and get recovery suggestions
- **Insights**: AI-powered insights about your mental health patterns
- **Life Situations**: Explore common human struggles with psychological explanations
- **Profile**: View your 30-day progress and personal mind profile
- **AI Coach**: Chat with an AI companion for mental health insights
- **Settings**: Customize theme, notifications, and preferences

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Zustand** (state management)
- **Recharts** (data visualization)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── self-awareness/    # Self-awareness tracking
│   ├── mental-load/       # Mental load monitoring
│   ├── energy/            # Energy patterns
│   ├── planner/           # Task planning
│   ├── burnout/           # Burnout tracking
│   ├── insights/          # AI insights
│   ├── life-situations/   # Life situations guide
│   ├── profile/           # User profile
│   ├── ai-coach/          # AI chat interface
│   └── settings/          # App settings
├── components/            # Reusable components
│   ├── sidebar.tsx        # Navigation sidebar
│   └── theme-provider.tsx # Theme management
├── lib/                   # Utilities and data
│   ├── store.ts          # Zustand state store
│   ├── mock-data.ts      # Mock data generator
│   └── utils.ts          # Utility functions
└── app/globals.css       # Global styles
```

## Features Overview

### Mock Data
The app comes with rich mock data including:
- 12 months of mood tracking data
- Energy level patterns
- Burnout risk indicators
- Tasks and focus sessions
- Reflections and life situations

All data is generated locally and can be replaced with real data sources when ready.

### Theme Support
- Light mode
- Dark mode
- System preference (auto)

### Animations
All pages include smooth animations using Framer Motion for a polished, professional feel.

## Development

The app is built with production-ready practices:
- TypeScript for type safety
- Responsive design
- Accessible UI components
- Smooth animations
- Clean, maintainable code structure

## License

This project is built for personal use and mental health support.


// lib/content.ts - Centralized content for dashboard
export const CT = {
  dashboard: {
    welcome: {
      greeting: "Welcome Back",
      subtitle: "Ready to elevate your debate game? Let's dive in! 🚀"
    },
    
    hero: {
      headline: "Find Your Voice in a Safe Space to Speak",
      subtitle: "MyDebateAI gives you a judgment-free arena to express, experiment, and evolve. Practice anytime, get instant AI feedback, and grow with a supportive global community."
    },
    
    features: {
      title: "Key Features That Empower Your Voice",
      subtitle: "Transform every idea into impact through adaptive AI, real-time feedback, and global collaboration.",
      
      chanakyaAI: {
        title: "Chanakya AI",
        description: "Debate with the best. Your ultimate speaking mentor available 24×7 to challenge, refine, and elevate your skills.",
        badge: "24/7 Ready"
      },
      
      munWorld: {
        title: "MUN World", 
        description: "Real-time analytics for delegates and debaters. Track clarity, pace, and persuasion and watch your confidence rise.",
        badge: "Enter the Battlefield"
      },
      
      events: {
        title: "Our World, Your Stage",
        description: "Step into a world where ideas collide and voices matter. Welcome to Our World represent nations, exchange ideas, and grow with peers across the globe.",
        badge: "Our World,Your Stage"
      },
      
      history: {
        title: "Track. Earn. Evolve.",
        description: "Celebrate progress as you grow badges, streaks, leaderboards, and topic unlocks designed to keep your journey exciting and measurable.",
        badge: "Progress Tracking"
      }
    },
    
    bottomSection: {
      title: "Practice Without Pressure, Perform Without Fear",
      subtitle: "A safe, supportive space to build your voice, refine your delivery, and speak with confidence — one debate at a time."
    },
    
    buttons: {
      prepare: "Prepare with Us",
      practiceAI: "Practice with AI", 
      performPeers: "Perform with Peers",
      feedback: "Get Structured Feedback",
      dropMic: "Drop the Mic – Start the Speech",
      startPracticing: "Drop the Mic – Start the Speech",
      viewProgress: "View Your Progress",
      joinMUN: "Join the MUN Experience"
    }
  }
} as const;
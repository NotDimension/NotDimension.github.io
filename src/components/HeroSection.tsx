@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 155 45% 3%; 
    --foreground: 155 10% 98%;
    --card: 155 40% 5%;
    --accent: 155 100% 45%; 
    --border: 155 30% 18%;
    --radius: 1rem;
  }
}

@layer base {
  body {
    background-color: hsl(var(--background));
    @apply text-foreground font-sans antialiased min-h-screen;
  }
}

/* 1. HERO BACKGROUND */
.grid-bg {
  position: relative;
  background-image: 
    linear-gradient(to bottom, rgba(3, 13, 8, 0.7) 0%, rgba(3, 13, 8, 1) 100%),
    url('/image(3).jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

/* 2. THE FIX: UNIVERSAL BORDER SELECTOR */
/* This targets .glass-card, .role-card, and ANY div that acts as a container in your sections */
.glass-card, 
.role-card,
section div[class*="bg-card"],
section div[class*="rounded-xl"],
section div[class*="border"] {
  @apply relative transition-all duration-500 ease-out;
  background: hsl(var(--card) / 0.6) !important;
  backdrop-filter: blur(12px);
  
  /* Force the Emerald Border back on */
  border: 1px solid hsl(var(--accent) / 0.3) !important;
  box-shadow: 0 0 20px hsl(var(--accent) / 0.05);
}

/* 3. HOVER STATE FOR ALL CONTAINERS */
.glass-card:hover, 
.role-card:hover,
section div[class*="bg-card"]:hover,
section div[class*="rounded-xl"]:hover {
  @apply -translate-y-1;
  border-color: hsl(var(--accent) / 0.8) !important;
  box-shadow: 0 0 30px hsl(var(--accent) / 0.15), 0 10px 40px rgba(0, 0, 0, 0.6);
}

/* 4. SECTION GLOWS */
section:not(.grid-bg) {
  background: radial-gradient(circle at center, hsl(155 100% 45% / 0.04) 0%, transparent 75%);
}

/* 5. UI ELEMENTS */
.glow-text {
  text-shadow: 0 0 15px hsl(var(--primary) / 0.4), 0 0 30px hsl(var(--accent) / 0.2);
}

.timeline-line {
  background: linear-gradient(to bottom, hsl(var(--accent) / 0.5), transparent);
}

.timeline-dot {
  background: hsl(var(--accent));
  box-shadow: 0 0 15px hsl(var(--accent) / 0.6);
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { 
  background: hsl(var(--accent) / 0.2); 
  border-radius: 10px; 
}

/* Noise overlay */
.noise-overlay::before {
  content: '';
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 50;
}

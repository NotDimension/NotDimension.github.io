@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 225 35% 5%;
    --foreground: 210 40% 95%;

    --card: 225 30% 9%;
    --card-foreground: 210 40% 95%;

    --popover: 225 30% 9%;
    --popover-foreground: 210 40% 95%;

    --primary: 210 100% 55%;
    --primary-foreground: 225 35% 5%;

    --secondary: 225 25% 14%;
    --secondary-foreground: 210 30% 80%;

    --muted: 225 25% 12%;
    --muted-foreground: 220 15% 50%;

    --accent: 200 90% 50%;
    --accent-foreground: 225 35% 5%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 225 20% 16%;
    --input: 225 20% 16%;
    --ring: 210 100% 55%;

    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: hsl(225 35% 5%); }
::-webkit-scrollbar-thumb { background: hsl(225 20% 20%); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: hsl(210 100% 55%); }

/* Glow */
.glow-text {
  text-shadow: 0 0 20px hsl(210 100% 55% / 0.5), 0 0 60px hsl(210 100% 55% / 0.15);
}

.glow-border {
  box-shadow: 0 0 20px hsl(210 100% 55% / 0.15), inset 0 0 20px hsl(210 100% 55% / 0.05);
}

/* Glass card */
.glass-card {
  background: hsl(225 25% 10% / 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid hsl(225 20% 18% / 0.8);
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  border-color: hsl(210 100% 55% / 0.35);
  box-shadow: 0 0 30px hsl(210 100% 55% / 0.1), 0 8px 32px hsl(225 35% 5% / 0.5);
  transform: translateY(-3px);
  background: hsl(225 25% 12% / 0.8);
}

/* Role card - bigger with nicer hover */
.role-card {
  background: hsl(225 25% 10% / 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid hsl(225 20% 18% / 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.role-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, hsl(210 100% 55% / 0.5), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.role-card:hover {
  border-color: hsl(210 100% 55% / 0.4);
  box-shadow: 0 0 40px hsl(210 100% 55% / 0.15), 0 12px 40px hsl(225 35% 5% / 0.6);
  transform: translateY(-4px) scale(1.01);
  background: hsl(225 25% 12% / 0.85);
}

.role-card:hover::before {
  opacity: 1;
}

/* Grid background */
.grid-bg {
  background-image:
    linear-gradient(hsl(225 20% 14% / 0.3) 1px, transparent 1px),
    linear-gradient(90deg, hsl(225 20% 14% / 0.3) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Noise overlay */
.noise-overlay::before {
  content: '';
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 50;
}

/* Page transition */
.page-container {
  animation: page-enter 0.5s ease-out;
}

@keyframes page-enter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Timeline */
.timeline-line {
  background: linear-gradient(to bottom, hsl(210 100% 55% / 0.3), hsl(210 100% 55% / 0.05));
}

.timeline-dot {
  background: hsl(210 100% 55%);
  box-shadow: 0 0 12px hsl(210 100% 55% / 0.5);
}

"use client";

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="6" className="fill-violet-500/10 stroke-violet-500/20" strokeWidth="1" />
      <path d="M7 8L4 12L7 16" className="stroke-violet-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L20 12L17 16" className="stroke-violet-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 17L13 7" className="stroke-white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.5" className="fill-emerald-400 animate-pulse" />
    </svg>
  );
}

"use client";

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g transform="translate(100, 100)" filter="url(#logo-glow)">
        {[0, 72, 144, 216, 288].map((rotate, i) => (
          <g key={i} transform={`rotate(${rotate})`}>
            <ellipse cx="30" cy="0" rx="40" ry="60" className="stroke-white/40" strokeWidth="0.3" fill="none" />
            <ellipse cx="28" cy="0" rx="38" ry="58" className="stroke-white/30" strokeWidth="0.2" fill="none" />
            <ellipse cx="26" cy="0" rx="36" ry="56" className="stroke-white/20" strokeWidth="0.1" fill="none" />
          </g>
        ))}
      </g>
      <circle cx="100" cy="100" r="4" className="fill-violet-500 animate-pulse shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
    </svg>
  );
}

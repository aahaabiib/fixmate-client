export default function NotFoundIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 320 240"
      className={className}
      role="img"
      aria-label="A gear showing 404 with a wrench and screwdriver crossed behind it"
    >
      {/* Wrench */}
      <g transform="rotate(-35 160 120)">
        <rect x="62" y="114" width="196" height="12" rx="6" className="fill-slate-400 dark:fill-slate-500" />
        <circle cx="62" cy="120" r="18" className="fill-slate-400 dark:fill-slate-500" />
        <rect x="40" y="113" width="20" height="14" className="fill-background" />
      </g>

      {/* Screwdriver */}
      <g transform="rotate(35 160 120)">
        <rect x="60" y="118" width="180" height="4" rx="2" className="fill-slate-400 dark:fill-slate-500" />
        <rect x="226" y="110" width="40" height="20" rx="8" className="fill-orange-500" />
      </g>

      {/* Gear ring */}
      <circle
        cx="160"
        cy="120"
        r="80"
        fill="none"
        strokeWidth="14"
        strokeDasharray="12 8.4"
        className="stroke-orange-500/50"
      />
      <circle
        cx="160"
        cy="120"
        r="68"
        strokeWidth="6"
        className="fill-card stroke-orange-500"
      />

      <text
        x="160"
        y="138"
        textAnchor="middle"
        fontSize="52"
        fontWeight="800"
        className="fill-foreground"
      >
        404
      </text>
    </svg>
  );
}
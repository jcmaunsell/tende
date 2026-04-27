const ITEMS = Array(14).fill("garden to palm ✦ ");

export default function Ticker({ variant = "default" }: { variant?: "default" | "light" }) {
  const light = variant === "light";
  return (
    <div className={`overflow-hidden border-y py-3 ${light ? "border-white/10" : "border-parchment bg-background"}`}>
      <div className="ticker-track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className={`font-sans text-xs uppercase tracking-widest whitespace-nowrap px-3 ${light ? "text-white/50" : "text-muted"}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

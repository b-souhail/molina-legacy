const COLORS = {
  forest: "#1E3B2E",
  sage: "#6B805E",
  gold: "#B89A5A",
  cream: "#F4F1E7",
  deep: "#111613",
};

const MESSAGES = [
  "✦  Livraison offerte dès 500 MAD d'achat  ✦",
  "✦  Nouvelle collection Printemps disponible  ✦",
  "✦  Retours gratuits sous 30 jours  ✦",
  "✦  Commandez avant 14h — expédition le jour même  ✦",
];

export function TopBar() {
  const track = [...MESSAGES, ...MESSAGES]; 

  return (
    <div className="relative overflow-hidden w-full select-none" style={{ background: COLORS.forest, height: "40px" }} aria-label="Annonces promotionnelles">
      <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, ${COLORS.forest}, transparent)` }} />
      <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${COLORS.forest}, transparent)` }} />
      <div className="flex items-center h-full">
        <div className="flex whitespace-nowrap animate-[topbar-scroll_28s_linear_infinite]" style={{ gap: "4rem" }}>
          {track.map((msg, i) => (
            <span key={i} className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: COLORS.gold, fontFamily: "var(--font-montserrat)" }}>
              {msg}
            </span>
          ))}
        </div>
      </div>
      <style>
        {`@keyframes topbar-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }}`}
      </style>
    </div> 
  );
}
/**
 * Ademende achtergrond in de huisstijlkleuren (mint, blush, lavendel), gebruikt
 * op alle schermen: telefoon, beamer en quizmaster. Maten in vmax zodat het op
 * een smal telefoonscherm én op een breed beamerbeeld dezelfde sfeer geeft.
 * Negatieve delays laten elke vlek al "halverwege een ademhaling" beginnen,
 * zodat er bij het laden niets tegelijk begint te bewegen.
 */
export function FloralAccents() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="breath-blob breath-blob--mint breathe-a -top-[22vmax] -left-[18vmax] h-[62vmax] w-[62vmax]"
        style={{ animationDuration: "19s", animationDelay: "-3s" }}
      />
      <div
        className="breath-blob breath-blob--blush breathe-b -top-[18vmax] -right-[20vmax] h-[56vmax] w-[56vmax]"
        style={{ animationDuration: "23s", animationDelay: "-11s" }}
      />
      <div
        className="breath-blob breath-blob--lavender breathe-c -bottom-[24vmax] -left-[14vmax] h-[64vmax] w-[64vmax]"
        style={{ animationDuration: "27s", animationDelay: "-7s" }}
      />
      <div
        className="breath-blob breath-blob--mint breathe-b -bottom-[20vmax] -right-[18vmax] h-[54vmax] w-[54vmax]"
        style={{ animationDuration: "21s", animationDelay: "-15s" }}
      />
      <div
        className="breath-blob breath-blob--blush breathe-c top-[30%] left-[35%] h-[38vmax] w-[38vmax]"
        style={{ animationDuration: "31s", animationDelay: "-20s" }}
      />
      <div className="breath-glow" />
      <svg
        className="animate-leaf-sway absolute top-6 right-6 h-16 w-16 text-lavender-deep opacity-70"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M32 8c4 6 4 12 0 18-4-6-4-12 0-18Z"
          fill="currentColor"
        />
        <path
          d="M32 26c8 0 14 4 18 10-8 2-14 0-18-6-4 6-10 8-18 6 4-6 10-10 18-10Z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

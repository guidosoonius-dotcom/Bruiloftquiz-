export function FloralAccents() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-mint blur-3xl opacity-60" />
      <div className="absolute -top-16 -right-20 h-64 w-64 rounded-full bg-blush blur-3xl opacity-60" />
      <div className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-lavender blur-3xl opacity-50" />
      <div className="absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-mint blur-3xl opacity-40" />
      <svg
        className="absolute top-6 right-6 h-16 w-16 text-lavender-deep opacity-70"
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

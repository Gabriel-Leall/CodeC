
export function HankoStamp() {
  return (
    <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 animate-in fade-in duration-500">
      <svg
        viewBox="0 0 40 40"
        className="size-9 text-rose-800/25 dark:text-rose-600/35 transition-all duration-500 scale-110"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Distressed Hanko border */}
        <path d="M 6 6 C 12 5.2, 28 6.8, 34 6 C 33 13, 34.5 27, 33 34 C 27 33, 13 34.8, 6 34 C 6.8 27, 5.2 13, 6 6 Z" />
        {/* Stylized Kanji stroke work for "道" (Tao/Path) */}
        <path d="M 12 13 C 15 13, 18 13.5, 21 13 M 16 13 L 16 19 M 13 19 C 16 19, 21 19.5, 24 19 M 12 25 C 16 25, 22 25.5, 28 25 M 19 19 L 19 31 M 23 21 C 26 23, 27 26, 28 30 M 13 30 C 13.5 27, 14.5 24, 15 21" />
      </svg>
    </span>
  );
}

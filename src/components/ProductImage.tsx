"use client";

const categoryGradients: Record<string, [string, string]> = {
  Recovery: ["from-sky-600", "to-blue-500"],
  Metabolic: ["from-amber-600", "to-orange-500"],
  "Growth Hormone": ["from-blue-600", "to-indigo-500"],
  Nootropic: ["from-violet-600", "to-purple-500"],
  Longevity: ["from-cyan-600", "to-blue-500"],
  Cosmetic: ["from-pink-600", "to-rose-500"],
  Immune: ["from-sky-600", "to-sky-500"],
  Mitochondrial: ["from-sky-600", "to-cyan-500"],
  Sleep: ["from-indigo-600", "to-violet-500"],
  Stacks: ["from-sky-600", "to-cyan-500"],
};

const defaultGradient: [string, string] = ["from-zinc-600", "to-gray-500"];

const sizeClasses = {
  sm: "h-32 w-32",
  md: "h-48 w-48",
  lg: "aspect-square w-full",
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface ProductImageProps {
  category: string;
  productName: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ProductImage({
  category,
  productName,
  className = "",
  size = "lg",
}: ProductImageProps) {
  const [from, to] = categoryGradients[category] ?? defaultGradient;
  const initials = getInitials(productName);

  return (
    <div
      className={`group relative flex items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${from} ${to} ${sizeClasses[size]} ${className}`}
    >
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30">
        {/* Hexagon / molecular grid pattern */}
        <svg
          className="h-full w-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`hex-${productName.replace(/\s/g, "")}`}
              x="0"
              y="0"
              width="40"
              height="46"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1.2)"
            >
              <polygon
                points="20,2 36,12 36,32 20,42 4,32 4,12"
                fill="none"
                stroke="white"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#hex-${productName.replace(/\s/g, "")})`}
          />
        </svg>
      </div>

      {/* Molecular / atom decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 transition-transform duration-500 group-hover:scale-110">
        <svg
          className="h-3/4 w-3/4"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="white"
            strokeWidth="0.3"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="white"
            strokeWidth="0.2"
          />
          <circle cx="50" cy="30" r="3" fill="white" opacity="0.5" />
          <circle cx="70" cy="55" r="2.5" fill="white" opacity="0.4" />
          <circle cx="30" cy="60" r="2" fill="white" opacity="0.3" />
          <line
            x1="50"
            y1="30"
            x2="70"
            y2="55"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.4"
          />
          <line
            x1="70"
            y1="55"
            x2="30"
            y2="60"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.4"
          />
          <line
            x1="30"
            y1="60"
            x2="50"
            y2="30"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Product initials */}
      <span className="relative z-10 select-none text-center font-bold text-white/80 transition-transform duration-300 group-hover:scale-110"
        style={{
          fontSize: size === "sm" ? "1.5rem" : size === "md" ? "2.25rem" : "4rem",
        }}
      >
        {initials}
      </span>

      {/* Hover glow */}
      <div className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/5" />
    </div>
  );
}

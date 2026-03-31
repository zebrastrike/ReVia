export default function WaveDivider({
  flip = false,
  fromColor = "white",
  toColor = "sky",
}: {
  flip?: boolean;
  fromColor?: "white" | "sky";
  toColor?: "white" | "sky";
}) {
  const fills: Record<string, string> = {
    white: "#ffffff",
    sky: "#e0f2fe",
  };

  return (
    <div className={`relative w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`} style={{ marginTop: "-1px", marginBottom: "-1px" }}>
      <svg
        className="relative block w-full h-[40px] sm:h-[60px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 C150,90 350,0 500,60 C650,120 850,30 1000,70 C1100,90 1150,50 1200,80 L1200,120 L0,120 Z"
          fill={fills[toColor]}
        />
        <path
          d="M0,30 C200,80 400,10 600,50 C800,90 1000,20 1200,60 L1200,120 L0,120 Z"
          fill={fills[toColor]}
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

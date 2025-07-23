import React from "react";

interface SemiCircleProgressProps {
  total: number;
  consumed: number;
}

const SemiCircleProgress: React.FC<SemiCircleProgressProps> = ({
  total,
  consumed,
}) => {
  const radius = 200;
  const stroke = 50;
  const circumference = Math.PI * radius; // half-circle
  const remaining = Math.max(total - consumed, 0);
  const progress = Math.min(remaining / total, 1);
  const offset = circumference * (1 - progress);

  return (
    <svg
      width={radius * 2 + stroke}
      height={radius + stroke}
      viewBox={`0 0 ${radius * 2 + stroke} ${radius + stroke}`}
    >
      {/* Background Arc */}
      <path
        d={`M ${stroke / 2},${
          radius + stroke / 2
        } A ${radius},${radius} 0 0 1 ${radius * 2 + stroke / 2},${
          radius + stroke / 2
        }`}
        fill="none"
        stroke="#e6e6e6"
        strokeWidth={stroke}
      />
      {/* Progress Arc */}
      <path
        d={`M ${stroke / 2},${
          radius + stroke / 2
        } A ${radius},${radius} 0 0 1 ${radius * 2 + stroke / 2},${
          radius + stroke / 2
        }`}
        fill="none"
        stroke="#86efac"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      {/* Text */}
      <text
        x="50%"
        y="70%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="16"
        fill="#333"
      >
        {Math.max(total - consumed, 0)} kcal left
      </text>
    </svg>
  );
};

export default SemiCircleProgress;

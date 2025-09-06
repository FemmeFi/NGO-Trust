import React from "react";

interface NGOTrustLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const NGOTrustLogo: React.FC<NGOTrustLogoProps> = ({ className = "", width = 40, height = 40 }) => {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Heart-shaped hands logo */}
        <g>
          {/* Left hand (dark blue) */}
          <path
            d="M25 45 C20 40, 15 35, 20 30 C25 25, 30 20, 35 25 C40 30, 45 35, 40 40 C35 45, 30 50, 25 45 Z"
            fill="#1e3a8a"
            stroke="#1e40af"
            strokeWidth="1"
            className="drop-shadow-md"
          />
          {/* Right hand (light blue) */}
          <path
            d="M75 45 C80 40, 85 35, 80 30 C75 25, 70 20, 65 25 C60 30, 55 35, 60 40 C65 45, 70 50, 75 45 Z"
            fill="#3b82f6"
            stroke="#2563eb"
            strokeWidth="1"
            className="drop-shadow-md"
          />
          {/* Heart center */}
          <path
            d="M45 55 C47 53, 53 53, 55 55 C57 57, 57 60, 55 62 C53 64, 47 64, 45 62 C43 60, 43 57, 45 55 Z"
            fill="#ef4444"
            className="drop-shadow-sm"
          />
        </g>
      </svg>
    </div>
  );
};

export default NGOTrustLogo;

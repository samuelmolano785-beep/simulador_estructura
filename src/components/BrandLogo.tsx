import React from 'react';

interface BrandLogoProps {
  className?: string;
  color?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'w-9 h-7',
  color = 'currentColor',
}) => {
  return (
    <svg
      viewBox="0 0 64 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Twin bridge towers */}
      <path
        d="M17 6V38M21 10V38M43 10V38M47 6V38"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Tower crossbeams */}
      <path
        d="M16 14H22M42 14H48"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Main suspension cables */}
      <path
        d="M4 32C11 26 15 16 19 8C25 22 39 22 45 8C49 16 53 26 60 32"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Vertical suspender hangers */}
      <path
        d="M11 27V33M25 18V33M32 21V33M39 18V33M53 27V33"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Deck roadway */}
      <path
        d="M3 33.5H61"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Under-deck truss hint */}
      <path
        d="M7 33.5L13 38L19 33.5L25.5 38L32 33.5L38.5 38L45 33.5L51 38L57 33.5"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
};

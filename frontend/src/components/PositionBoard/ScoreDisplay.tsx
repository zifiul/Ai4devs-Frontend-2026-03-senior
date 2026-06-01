import React from 'react';

type ScoreDisplayProps = {
  score: number;
};

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const floored = Math.floor(score);

  return (
    <span aria-label={`Score: ${floored} out of 5`} className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`text-[12px] leading-none ${i < floored ? 'text-[#f59e0b]' : 'text-[#c3c6d8]'}`}
        >
          {i < floored ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
};

export default ScoreDisplay;

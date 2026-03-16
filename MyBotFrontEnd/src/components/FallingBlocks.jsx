import React, { useMemo } from 'react';
import './FallingBlocks.css';

const COLORS = [
  '#FF6B6B', // coral
  '#FFD93D', // sunny yellow
  '#6BCB77', // green
  '#4D96FF', // sky blue
  '#FF8FD8', // pink
  '#FF9F45', // orange
  '#A78BFA', // purple
  '#38BDF8', // light blue
];

const SHAPES = ['circle', 'square', 'star', 'triangle', 'gear'];
const ANIMATIONS = ['floatDown', 'drift', 'bob'];

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const FallingBlocks = ({ count = 14, section = 'default' }) => {
  const blocks = useMemo(() => {
    const sectionSeed = section.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    return Array.from({ length: count }, (_, i) => {
      const seed = sectionSeed + i * 7;
      const r = (offset) => seededRandom(seed + offset);

      const shape = SHAPES[Math.floor(r(1) * SHAPES.length)];
      const color = COLORS[Math.floor(r(2) * COLORS.length)];
      const size = 16 + Math.floor(r(3) * 36); // 16–52px
      const left = r(4) * 100; // 0–100%
      const top = r(5) * 100;
      const animName = ANIMATIONS[Math.floor(r(6) * ANIMATIONS.length)];
      const duration = 10 + r(7) * 20; // 10–30s
      const delay = r(8) * 12; // 0–12s
      const opacity = 0.08 + r(9) * 0.16; // 0.08–0.24

      return {
        shape,
        color,
        size,
        left,
        top,
        animName,
        duration,
        delay,
        opacity,
      };
    });
  }, [count, section]);

  return (
    <div className="falling-blocks-container" aria-hidden="true">
      {blocks.map((block, i) => {
        const style = {
          width: block.shape === 'triangle' ? 0 : block.size,
          height: block.shape === 'triangle' ? 0 : block.size,
          left: `${block.left}%`,
          top: `${block.top}%`,
          background: block.shape === 'triangle' || block.shape === 'star' ? undefined : block.color,
          color: block.color, // used by triangle border-bottom-color via currentColor
          animationName: block.animName,
          animationDuration: `${block.duration}s`,
          animationDelay: `${block.delay}s`,
          opacity: block.opacity,
        };

        if (block.shape === 'triangle') {
          style.borderBottomColor = block.color;
          const triSize = block.size * 0.55;
          style.borderLeftWidth = triSize;
          style.borderRightWidth = triSize;
          style.borderBottomWidth = triSize * 1.7;
        }

        if (block.shape === 'star') {
          style.background = block.color;
        }

        return (
          <div
            key={i}
            className={`falling-block ${block.shape}`}
            style={style}
          />
        );
      })}
    </div>
  );
};

export default FallingBlocks;

/* =============================================================
   CursorTrail.tsx — Canvas-based Curly Cursor Trail
   =============================================================
   Purpose   : Renders a spring-physics cursor trail on a full-screen
               canvas using quadratic bezier curves.
   Used by   : RootLayout (src/pages/__root.tsx)
   Depends on: React (useEffect, useRef)
   Notes     : Disabled on touch/mobile devices automatically.
               Trail color matches ABC LUX gold palette.
   ============================================================= */

import { useEffect, useRef } from 'react';

/** Configuration for the cursor trail physics and appearance */
const PARAMS = {
  pointsNumber: 40,
  widthFactor: 0.1,
  spring: 0.4,
  friction: 0.5,
};

/** CursorTrail
 * Mounts a full-screen canvas and animates a gold spring-physics
 * cursor trail. Cleans up all listeners and animation frames on unmount.
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Don't run on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Pointer position — starts at center
    const pointer = {
      x: 0.5 * window.innerWidth,
      y: 0.5 * window.innerHeight,
    };

    // Spring trail points
    const trail = Array.from({ length: PARAMS.pointsNumber }, () => ({
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    }));

    // Resize canvas to fill viewport
    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setupCanvas();
    window.addEventListener('resize', setupCanvas, { passive: true });

    // Track mouse position
    const onMouseMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Animation loop
    let rafId: number;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update spring physics for each trail point
      trail.forEach((p, i) => {
        const prev = i === 0 ? pointer : trail[i - 1];
        const spring = i === 0 ? 0.4 * PARAMS.spring : PARAMS.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= PARAMS.friction;
        p.dy *= PARAMS.friction;
        p.x += p.dx;
        p.y += p.dy;
      });

      // Draw the curly trail with quadratic bezier curves
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(198, 167, 106, 0.6)';
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = PARAMS.widthFactor * (PARAMS.pointsNumber - i);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(xc, yc);
      }

      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      ctx.stroke();

      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', setupCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}

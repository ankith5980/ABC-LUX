/* =============================================================
   CursorTrail.tsx — Custom Mouse Trail Animation
   =============================================================
   Purpose   : Renders a fluid, spring-physics based glowing cursor trail on a fixed canvas.
   Used by   : RootLayout (src/pages/__root.tsx)
   Depends on: react (useRef, useEffect)
   Notes     : Automatically disables itself on mobile devices via CSS media queries.
   ============================================================= */

import React, { useEffect, useRef } from 'react';

/**
 * CursorTrail
 * Instantiates a full-screen canvas that draws a continuous, glowing kinematic line following the mouse cursor.
 * Props: None
 */
const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number | null>(null);

  const POINT_COUNT = 50;
  const TENSION = 0.35;
  const DAMPING = 0.62;

  // Effect: Mounts the canvas, binds event listeners, and starts the render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initializes the set of 50 coordinate points that make up the kinematic chain
    const initPoints = () => {
      pointsRef.current = [];
      const startX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
      const startY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
      for (let i = 0; i < POINT_COUNT; i++) {
        pointsRef.current.push({ x: startX, y: startY });
      }
    };

    // Resizes the canvas to match viewport and handles high-DPI scaling
    const resize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        contextRef.current = ctx;
      }
    };

    // Updates the target coordinates based on mouse position
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Core render loop: calculates spring physics for each point and draws the glow lines
    const animate = () => {
      const ctx = contextRef.current;
      const points = pointsRef.current;
      const mouse = mouseRef.current;

      if (!ctx || !canvas || points.length === 0) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lead point follows mouse with spring physics
      points[0].x += (mouse.x - points[0].x) * TENSION;
      points[0].y += (mouse.y - points[0].y) * TENSION;

      // Each subsequent point chases the one ahead (kinematic chain)
      for (let i = 1; i < POINT_COUNT; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        curr.x += (prev.x - curr.x) * (TENSION * DAMPING);
        curr.y += (prev.y - curr.y) * (TENSION * DAMPING);
      }

      // Draw the glowing ribbon
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < POINT_COUNT - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }

      // Gradient stroke that fades
      const gradient = ctx.createLinearGradient(
        points[0].x, points[0].y,
        points[POINT_COUNT - 1].x, points[POINT_COUNT - 1].y
      );
      gradient.addColorStop(0, 'rgba(198, 167, 106, 0.6)');
      gradient.addColorStop(0.3, 'rgba(198, 167, 106, 0.3)');
      gradient.addColorStop(0.6, 'rgba(123, 81, 54, 0.15)');
      gradient.addColorStop(1, 'rgba(123, 81, 54, 0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Glow layer
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < Math.min(15, POINT_COUNT - 1); i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }
      ctx.strokeStyle = 'rgba(198, 167, 106, 0.15)';
      ctx.lineWidth = 8;
      ctx.stroke();

      animationIdRef.current = requestAnimationFrame(animate);
    };

    initPoints();
    resize();
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-trail-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default CursorTrail;

import React, { useEffect, useRef, useState } from 'react';

export default function SmokeCanvas({ triggerPuff, onPuffComplete }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, lastX: -1000, lastY: -1000, speed: 0 });
  const lastScrollY = useRef(window.scrollY);
  const scrollVelocity = useRef(0);
  const animFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle factory
    const createParticle = (x, y, vx = 0, vy = 0, size = 12, maxLife = 180, alpha = 0.22) => {
      return {
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: vx + (Math.random() - 0.5) * 0.8,
        vy: vy - Math.random() * 1.4 - 0.6, // buoyant upward drift
        size: size * (0.8 + Math.random() * 0.6),
        growth: 0.35 + Math.random() * 0.3,
        alpha: alpha * (0.7 + Math.random() * 0.6),
        maxAlpha: alpha,
        life: 0,
        maxLife: maxLife + Math.random() * 60,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.02,
        turbulenceOffset: Math.random() * 100,
      };
    };

    // Track mouse & touch movements to spawn gentle ribbons of smoke
    const handleMouseMove = (e) => {
      const dx = e.clientX - mouseRef.current.lastX;
      const dy = e.clientY - mouseRef.current.lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      mouseRef.current.speed = dist;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (dist > 3 && particlesRef.current.length < 240) {
        // Emit delicate smoke trail
        particlesRef.current.push(
          createParticle(
            e.clientX,
            e.clientY,
            dx * 0.08,
            dy * 0.08 - 0.5,
            14,
            160,
            Math.min(0.2, dist * 0.008 + 0.06)
          )
        );
      }
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
      }
    };

    // Track scroll velocity: scrolling billows smoke gently
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      scrollVelocity.current = delta;
      lastScrollY.current = currentY;

      // When scrolling, spawn subtle wisps from viewport edges
      if (Math.abs(delta) > 10 && particlesRef.current.length < 240) {
        const count = Math.min(4, Math.floor(Math.abs(delta) / 15));
        for (let i = 0; i < count; i++) {
          const spawnX = Math.random() * window.innerWidth;
          const spawnY = delta > 0 ? window.innerHeight - 20 : 40;
          particlesRef.current.push(
            createParticle(
              spawnX,
              spawnY,
              (Math.random() - 0.5) * 1.5,
              delta > 0 ? -1.8 : 1.2,
              20,
              180,
              0.14
            )
          );
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Ambient candle smoke origin in bottom/hero center
    let ambientTick = 0;

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ambientTick++;
      // Constant organic gentle wisps (like an unlit candle smoldering softly)
      if (ambientTick % 30 === 0 && particlesRef.current.length < 200) {
        const originX = window.innerWidth * 0.5 + Math.sin(ambientTick * 0.02) * 80;
        const originY = window.innerHeight * 0.65;
        particlesRef.current.push(
          createParticle(originX, originY, 0, -0.8, 12, 220, 0.12)
        );
      }

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Physics: rising with smooth curl turbulence
        p.x += p.vx + Math.sin((p.life + p.turbulenceOffset) * 0.03) * 0.6;
        p.y += p.vy;
        p.angle += p.angularVelocity;
        p.size += p.growth;

        // Life cycle opacity fade
        const progress = p.life / p.maxLife;
        let currentAlpha = 0;
        if (progress < 0.2) {
          currentAlpha = (progress / 0.2) * p.maxAlpha;
        } else {
          currentAlpha = (1 - (progress - 0.2) / 0.8) * p.maxAlpha;
        }

        if (p.life >= p.maxLife || currentAlpha <= 0.002) {
          particles.splice(i, 1);
          continue;
        }

        // Render soft radial smoke puff
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        // Off-white ivory & warm ethereal slate smoke colors
        gradient.addColorStop(0, `rgba(244, 240, 232, ${currentAlpha})`);
        gradient.addColorStop(0.4, `rgba(226, 219, 208, ${currentAlpha * 0.6})`);
        gradient.addColorStop(0.8, `rgba(180, 172, 160, ${currentAlpha * 0.2})`);
        gradient.addColorStop(1, 'rgba(240, 235, 225, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Slightly oblong cloud to simulate ribbon of curling smoke
        ctx.ellipse(0, 0, p.size, p.size * 0.82, p.angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  // Handle external trigger (e.g. clicking the unlit candle motif)
  useEffect(() => {
    if (triggerPuff && triggerPuff.active) {
      const { x, y } = triggerPuff;
      // Spawn a dramatic plume of rising candle smoke
      for (let i = 0; i < 35; i++) {
        setTimeout(() => {
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 16,
            y: y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.8,
            vy: -Math.random() * 2.8 - 1.2,
            size: 16 + Math.random() * 12,
            growth: 0.45 + Math.random() * 0.35,
            alpha: 0.35,
            maxAlpha: 0.35,
            life: 0,
            maxLife: 240 + Math.random() * 80,
            angle: Math.random() * Math.PI * 2,
            angularVelocity: (Math.random() - 0.5) * 0.03,
            turbulenceOffset: Math.random() * 100,
          });
        }, i * 25);
      }
      if (onPuffComplete) onPuffComplete();
    }
  }, [triggerPuff, onPuffComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 mix-blend-multiply opacity-80"
      aria-hidden="true"
    />
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function SoundAmbiance() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);

  const toggleAudio = () => {
    if (!isPlaying) {
      // Start meditative room tone
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) {
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;

          // Warm harmonic drone (simulating a quiet Zurich art gallery / temple stillness)
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 3);
          masterGain.connect(ctx.destination);
          gainNodeRef.current = masterGain;

          // Fundamental warm sine waves (F#2 ~ 92.5Hz, C#3 ~ 138.5Hz, A#3 ~ 233Hz)
          const frequencies = [92.5, 138.5, 233.08];
          frequencies.forEach(freq => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            oscGain.gain.setValueAtTime(0.3, ctx.currentTime);

            // Subtle LFO for gentle breathing movement
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
            lfoGain.gain.setValueAtTime(0.15, ctx.currentTime);
            lfo.connect(oscGain.gain);
            lfo.start();

            osc.connect(oscGain);
            oscGain.connect(masterGain);
            osc.start();
          });
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        setIsPlaying(true);
      } catch (e) {
        console.warn('Audio not allowed yet:', e);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1A1817]/10 hover:border-[#1A1817]/30 bg-white/40 backdrop-blur-sm transition-all duration-300 text-xs text-[#1A1817]/70 hover:text-[#1A1817]"
      title={isPlaying ? "Mute Studio Ambiance" : "Listen to Gallery Ambiance"}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#A88B57] animate-pulse" />
          <span className="font-sans text-[11px] tracking-wider uppercase hidden sm:inline">Stillness On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#1A1817]/50 group-hover:text-[#1A1817]" />
          <span className="font-sans text-[11px] tracking-wider uppercase hidden sm:inline">Ambiance</span>
        </>
      )}
    </button>
  );
}

import React, { useState, useRef } from 'react';
import { artistData } from '../data/artist';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export default function VideoReel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="studio-film" className="py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-[#1A1817]/08">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A88B57]">
            <span>Richterswil Studio Documentation</span>
            <span className="w-8 h-[1px] bg-[#A88B57]/40" />
            <span>Process In Motion</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1A1817] tracking-tight">
            The Movement of Stillness
          </h2>

          <p className="font-serif italic text-lg text-[#1A1817]/70 font-light">
            Observing the interplay of liquid pigment, photographic textures, and intuitive gestures in the studio.
          </p>
        </div>

        <div className="text-xs font-sans uppercase tracking-widest text-[#1A1817]/40">
          Studio Archive Reel
        </div>
      </div>

      {/* Video Cinema Container with Soft Luxury Shadow */}
      <div className="relative aspect-video max-w-5xl mx-auto rounded-[6px] overflow-hidden bg-[#1A1817] fine-art-shadow group">
        <video
          ref={videoRef}
          src={artistData.media.video}
          playsInline
          loop
          muted={isMuted}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
          onClick={togglePlay}
        />

        {/* Center Big Play Button if paused */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer group"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/40 bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 hover:bg-white hover:text-[#1A1817] transition-all duration-500 shadow-2xl">
              <Play className="w-8 h-8 ml-1" />
            </div>
          </div>
        )}

        {/* Video Player Floating Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <span className="text-[11px] font-sans tracking-widest uppercase opacity-80">
              Shalona's Studio · Richterswil
            </span>
          </div>

          <div className="text-[10px] font-mono tracking-widest uppercase opacity-70 hidden sm:block">
            4K Photographic Archive
          </div>
        </div>
      </div>
    </section>
  );
}

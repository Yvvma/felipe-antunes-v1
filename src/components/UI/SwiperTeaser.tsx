import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play, Pause, X } from "lucide-react";

type Teaser = {
  src: string;
  titulo: string;
  artista: string;
  spotify?: string;
};

type Props = {
  teasers: Teaser[];
};

export default function TeaserSwiper({ teasers }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: teasers.length > 1,
    align: 'center',
    skipSnaps: teasers.length <= 1,
    inViewThreshold: 0.7
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      // Pause all videos when sliding
      videoRefs.current.forEach(video => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    };
    
    emblaApi.on("select", onSelect);
    onSelect();
    
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const openVideo = useCallback((index: number) => {
    setCurrentVideo(index);
    setIsPlaying(true);
    setIsMuted(false);
  }, []);

  const closeVideo = useCallback(() => {
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentVideo(null);
      setProgress(0);
      if (modalVideoRef.current) {
        modalVideoRef.current.currentTime = 0;
      }
    }, 300);
  }, []);

  const togglePlay = useCallback(() => {
    if (!modalVideoRef.current) return;
    
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play().catch(e => console.error("Video play failed:", e));
      setIsPlaying(true);
    } else {
      modalVideoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !modalVideoRef.current.muted;
      setIsMuted(modalVideoRef.current.muted);
    }
  }, []);

  useEffect(() => {
    if (currentVideo === null || !modalVideoRef.current) return;

    const updateProgress = () => {
      if (modalVideoRef.current) {
        const { currentTime, duration } = modalVideoRef.current;
        setProgress((currentTime / duration) * 100 || 0);
      }
    };

    const video = modalVideoRef.current;
    video.addEventListener('timeupdate', updateProgress);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
    };
  }, [currentVideo]);

  useEffect(() => {
    if (currentVideo !== null && modalVideoRef.current) {
      if (isPlaying) {
        modalVideoRef.current.play().catch(e => console.error("Video play failed:", e));
      } else {
        modalVideoRef.current.pause();
      }
    }
  }, [currentVideo, isPlaying]);

  if (teasers.length === 0) {
    return (
      <div className="w-full py-8 text-center text-[#c9f711]">
        No teasers available
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center py-8 overflow-hidden">
      {teasers.length > 1 && (
        <button
          onClick={scrollPrev}
          className="z-10 text-white hover:bg-white/10 rounded-full p-2 transition absolute left-0 sm:relative"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      <div 
        className={`embla w-full max-w-full sm:max-w-4xl overflow-hidden ${
          teasers.length <= 1 ? 'flex justify-center' : ''
        }`}
        ref={emblaRef}
      >
        <div className="embla__container flex gap-4 sm:px-6">
          {teasers.map((teaser, index) => (
            <motion.div
              key={`${teaser.src}-${index}`}
              className={`embla__slide flex-shrink-0 w-88 sm:w-80 p-4 relative ${
                teasers.length <= 1 ? '!opacity-100 !scale-100' : ''
              }`}
              initial={{ opacity: 0.6, scale: 0.9 }}
              animate={{
                opacity: selectedIndex === index ? 1 : 0.6,
                scale: selectedIndex === index ? 1 : 0.9,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col justify-center items-center gap-4 border border-[#c9f711] p-4 bg-black rounded shadow-lg h-full">
                <div 
                  className="aspect-video overflow-hidden rounded relative w-full cursor-pointer group"
                  onClick={() => openVideo(index)}
                >
                  <video
                    ref={el => videoRefs.current[index] = el}
                    className="w-full h-full object-cover"
                    src={teaser.src}
                    playsInline
                    muted
                    loop
                    preload="metadata"
                  />
                  
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors"
                    initial={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-[#c9f711]/90 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play size={32} className="text-black ml-1" />
                    </motion.div>
                  </motion.div>
                </div>
                <div className="flex flex-col justify-center items-center text-center gap-2">
                  <h4 className="font-[FrutigerBlack] uppercase text-lg sm:text-2xl text-[#c9f711]">
                    {teaser.artista}
                  </h4>
                  <h4 className="font-[FrutigerLight] uppercase text-sm sm:text-xl text-[#c9f711]">
                    {teaser.titulo}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {teasers.length > 1 && (
        <button
          onClick={scrollNext}
          className="z-10 text-white hover:bg-white/10 rounded-full p-2 transition absolute right-0 sm:relative"
          aria-label="Próximo slide"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {currentVideo !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full p-2 transition"
              onClick={closeVideo}
              aria-label="Fechar"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-4xl aspect-video">
              <video
                ref={modalVideoRef}
                className="w-full h-full object-contain"
                src={teasers[currentVideo].src}
                playsInline
                onClick={togglePlay}
                onEnded={() => setIsPlaying(false)}
                autoPlay
              />

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-[#c9f711]" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="absolute bottom-4 left-4 flex gap-3">
                <button
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                  aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                
                <button
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                  aria-label={isMuted ? "Ativar som" : "Desativar som"}
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                      <line x1="22" y1="9" x2="16" y2="15"/>
                      <line x1="16" y1="9" x2="22" y2="15"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

type Slide = {
  tipo: "imagem" | "iframe";
  conteudo: string;
  artista: string;
  titulo?: string;
  spotify?: string;
};

type Props = {
  slides: Slide[];
};

const YouTubeThumbnail = ({ url, title, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Extract YouTube video ID from URL
  const getVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);

  return (
    <div 
      className="relative w-full h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-[#c9f711]/90 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <Play size={32} className="text-black ml-1" />
            </motion.div>
          </motion.div>
       
    </div>
  );
};

export default function EmblaVideoCarousel({ slides }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setPlayingVideo(null); // Reset playing video when sliding
    };
    
    emblaApi.on("select", onSelect);
    onSelect();
    
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const handleVideoClick = (index: number) => {
    if (slides[index].tipo === "iframe") {
      setPlayingVideo(playingVideo === index ? null : index);
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center py-8 overflow-hidden">
      {/* Left Arrow */}
      <button
        onClick={scrollPrev}
        className="z-10 text-white hover:bg-white/10 rounded-full p-2 transition absolute left-2 sm:relative"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Carousel */}
      <div
        className="embla w-full max-w-full sm:max-w-2xl overflow-hidden"
        ref={emblaRef}
      >
        <div className="embla__container flex gap-4 px-4 sm:px-6">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="embla__slide flex-shrink-0 w-64 sm:w-80"
              initial={{ opacity: 0.6, scale: 0.9 }}
              animate={{
                opacity: selectedIndex === index ? 1 : 0.6,
                scale: selectedIndex === index ? 1 : 0.9,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div className="flex flex-col justify-center items-center gap-4 border border-[#c9f711] p-4 bg-black rounded shadow-lg h-full">
                <div className="w-full aspect-video overflow-hidden rounded">
                  {slide.tipo === "imagem" ? (
                    <img
                      className="w-full h-full object-cover"
                      src={slide.conteudo}
                      alt={slide.titulo}
                    />
                  ) : playingVideo === index ? (
                    <iframe
                      className="w-full h-full rounded"
                      src={`${slide.conteudo}?autoplay=1`}
                      title={slide.titulo}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <YouTubeThumbnail 
                      url={slide.conteudo} 
                      title={slide.titulo} 
                      onClick={() => handleVideoClick(index)}
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center items-center text-center gap-2">
                  <h4 className="font-[FrutigerBlack] uppercase text-lg sm:text-2xl text-[#c9f711]">
                    {slide.artista}
                  </h4>
                  <h4 className="font-[FrutigerLight] uppercase text-sm sm:text-xl text-[#c9f711]">
                    {slide.titulo}
                  </h4>
                  {slide.spotify && (
                    <a
                      href={slide.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="uppercase text-xs sm:text-sm font-semibold font-[FrutigerRegular] text-black bg-[#c0f711] hover:bg-[#b3e300] px-4 py-2 transition">
                        Ouça Agora
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollNext}
        className="z-10 text-white hover:bg-white/10 rounded-full p-2 transition absolute right-2 sm:relative"
        aria-label="Próximo slide"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}
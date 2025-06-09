import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  imagem?: string;
  artista?: string;
  titulo?: string;
  spotify?: string;
};

type Props = {
  slides: Slide[];
};

export default function EmblaCarousel({ slides }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

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
            className="embla__slide flex-shrink-0 w-64 sm:w-124 "
            initial={{ opacity: 0.6, scale: 0.9 }}
            animate={{
              opacity: selectedIndex === index ? 1 : 0.6,
              scale: selectedIndex === index ? 1 : 0.9,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <div className="flex flex-col justify-center items-center gap-4 border border-[#c9f711] p-4 bg-black rounded shadow-lg h-full">
              <div className="w-full aspect-square overflow-hidden rounded">
                <img
                  className="w-full h-full object-cover"
                  src={slide.imagem}
                  alt={slide.titulo}
                />
              </div>
              <div className="flex flex-col justify-center items-center text-center gap-2">
                <h4 className="font-[FrutigerBlack] uppercase text-lg sm:text-2xl text-[#c9f711]">
                  {slide.artista}
                </h4>
                <h4 className="font-[FrutigerLight] uppercase text-sm sm:text-xl text-[#c9f711]">
                  {slide.titulo}
                </h4>
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

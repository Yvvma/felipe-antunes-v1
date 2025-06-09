import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

const YouTubeThumbnail = ({ url, title, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);

  return (
    <motion.div 
      className="relative w-full aspect-video cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover rounded"
        loading="lazy"
      />
      
      <AnimatePresence>
        {(isHovered || !url.includes("autoplay=1")) && (
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center rounded"
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
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const VideoCard = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    setIsPlaying(true);
  };

  return (
    <motion.div
      className="flex-shrink-0 w-full"
      initial={{ opacity: 0.6, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col justify-center items-center gap-4 border border-[#c9f711] p-4 bg-black rounded shadow-lg h-full">
        <div className="w-full aspect-video overflow-hidden rounded">
          {!isPlaying ? (
            <YouTubeThumbnail 
              url={video.src} 
              title={video.titulo} 
              onClick={handleClick}
            />
          ) : (
            <iframe
              src={`${video.src}?autoplay=1`}
              title={video.titulo}
              className="w-full h-full rounded"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        <div className="flex flex-col justify-center items-center text-center gap-2 w-full">
          <h4 className="font-[FrutigerBlack] uppercase text-lg sm:text-2xl text-[#c9f711]">
            {video.artista}
          </h4>
          <h4 className="font-[FrutigerLight] uppercase text-sm sm:text-xl text-[#c9f711]">
            {video.titulo}
          </h4>
          {video.ouvirLink && (
            <motion.a
              href={video.ouvirLink}
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase text-xs sm:text-sm font-semibold font-[FrutigerRegular] text-black bg-[#c0f711] hover:bg-[#b3e300] px-4 py-2 transition w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Assista Agora
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const VideoGrid = ({ videos }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {videos.map((video, index) => (
      <VideoCard key={index} video={video} />
    ))}
  </div>
);

export default function MusicVideos() {
  const albuns = [
     {
      nome: "EMBARCAÇÃO",
      videos: [
        {
          src: "https://www.youtube.com/embed/rYwUSWOWvTI",
          titulo: "Embarcação",
          artista: "Felipe Antunes",
          ouvirLink: "https://youtu.be/rYwUSWOWvTI?feature=shared"
        },
          {
          src: "https://www.youtube.com/embed/DGlGmUywju0",
          titulo: "Embarcação (Album Visual)",
          artista: "Felipe Antunes",
          ouvirLink: "https://youtu.be/DGlGmUywju0?feature=shared"
        },
      
      ]
    },
     {
      nome: "VISÃO NOTURNA",
      videos: [
        {
          src: "https://www.youtube.com/embed/f3rlaVqzclg",
          titulo: "Ao Pó",
          artista: "Felipe Antunes e Nástio Mosquito",
          ouvirLink: "https://youtu.be/f3rlaVqzclg?feature=shared"
        },
         {
          src: "https://www.youtube.com/embed/pNCOtuv2x-0",
          titulo: "Ninguém no Cosmos (Lyric Video)",
          artista: "Felipe Antunes e Nástio Mosquito",
          ouvirLink: "https://youtu.be/pNCOtuv2x-0?feature=shared"
        }, 
        {
    src: "https://www.youtube.com/embed/jU-sJMEw62Q",
    titulo: "Labirinto (Clipe Animação)",
    artista: "Felipe Antunes e Nástio Mosquito",
    ouvirLink: "https://youtu.be/jU-sJMEw62Q"
  }
        
      ]
    },
    {
      nome: "CRU",
      videos: [
        {
          src: "https://www.youtube.com/embed/6Rzqk-N2UF8",
          titulo: "Modelo Guanabara",
          artista: "Felipe Antunes",
          ouvirLink: "https://www.youtube.com/watch?v=6Rzqk-N2UF8"
        },
        {
    src: "https://www.youtube.com/embed/ncHhc38wvp8",
    titulo: "Cru",
    artista: "Felipe Antunes",
    ouvirLink: "https://youtu.be/ncHhc38wvp8"
  },
         {
    src: "https://www.youtube.com/embed/sjtPGr9DQ54",
    titulo: "Cru (Álbum Visual)",
    artista: "Felipe Antunes",
    ouvirLink: "https://youtu.be/sjtPGr9DQ54"
    },
      ]
    },
    {
      nome: "LÂMINA",
      videos: [
        {
          src: "https://www.youtube.com/embed/lRDnzcIHER8?",
          titulo: "Felipe Antunes",
          artista: "Vai Por mim",
          ouvirLink: "https://www.youtube.com/watch?v=lRDnzcIHER8"
        }, 
        {
    src: "https://www.youtube.com/embed/WDX8XCzzSeE",
    titulo: "Lâmina (Álbum Visual)",
    artista: "Felipe Antunes",
    ouvirLink: "https://youtu.be/WDX8XCzzSeE"
  },
      ]
    },
    {
      nome: "VITROLA SINTÉTICA",
      videos: [
       {
    src: "https://www.youtube.com/embed/GuyfWsSQr1c",
    titulo: "Faz Um Tempo",
    artista: "Vitrola Sintética",
    ouvirLink: "https://youtu.be/GuyfWsSQr1c"
  },
  {
    src: "https://www.youtube.com/embed/WqVyVPHBM9A",
    titulo: "Deus",
    artista: "Vitrola Sintética",
    ouvirLink: "https://youtu.be/WqVyVPHBM9A"
  },
  {
    src: "https://www.youtube.com/embed/yvTcv-SOjH4",
    titulo: "Massa Muscular",
    artista: "Vitrola Sintética",
    ouvirLink: "https://youtu.be/yvTcv-SOjH4"
  },
 
      ]
    }
  ];

  const livePerformances = [
    {
    src: "https://www.youtube.com/embed/3hM6NZUe6Lg",
    titulo: "Telepatizar (Ao Vivo)",
    artista: "Felipe Antunes",
    ouvirLink: "https://youtu.be/3hM6NZUe6Lg"
  },
  {
    src: "https://www.youtube.com/embed/QIvCex0oj3M",
    titulo: "Inconsciente Inconsistente (Ao Vivo)",
    artista: "Felipe Antunes",
    ouvirLink: "https://youtu.be/QIvCex0oj3M"
  },
  {
    src: "https://www.youtube.com/embed/_FmpznWMDNE",
    titulo: "Teaser Lâmina (Show de Lançamento)",
    artista: "Felipe Antunes",
    ouvirLink: "https://youtu.be/_FmpznWMDNE"
  },
  
  ];

  return (
    <section className="w-full py-16 bg-black text-white px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Albums Section */}
        {albuns.map((album, index) => (
          <motion.div 
            key={`album-${index}`} 
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-2xl sm:text-3xl font-[FrutigerBlack] text-[#c9f711] mb-8 border-b border-[#c9f711] pb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {album.nome}
            </motion.h3>
            <VideoGrid videos={album.videos} />
          </motion.div>
        ))}

        {/* Live Performances Section */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h3 
              className="text-2xl sm:text-3xl font-[FrutigerBlack] text-[#c9f711] mb-8 border-b border-[#c9f711] pb-2 uppercase"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Live Performances
            </motion.h3>
          <VideoGrid videos={livePerformances} />
        </motion.div>
      </div>
    </section>
  );
}
import { motion } from 'framer-motion';
import EmblaVideoCarousel from '../UI/SwiperVideo';

const VideoContainer = () => {
  return (
    <section className="flex flex-col sm:flex-row justify-center items-center w-full bg-gradient-to-b from-black/90 to-[#0c0c0c]  py-12 px-4 sm:px-8">
      
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8 z-50"
      >
        <h1 className="font-[FrutigerBold] uppercase text-3xl sm:text-4xl text-[#c9f711]">
          Videoclipes
        </h1>
      </motion.div>

      {/* Carrossel */}
      <div className="flex w-full max-w-full sm:max-w-4xl px-0">
      
          <EmblaVideoCarousel
          slides={[
            {
              tipo: "iframe",
              conteudo: "https://www.youtube.com/embed/rYwUSWOWvTI",
              artista: "Felipe Antunes",
              titulo: "Embarcação",
              spotify: "https://youtu.be/rYwUSWOWvTI",
            },
            {
              tipo: "iframe",
              conteudo: "https://www.youtube.com/embed/WqVyVPHBM9A",
              artista: "Vitrola Sintética",
              titulo: "Deus",
              spotify: "https://www.youtube.com/watch?v=WqVyVPHBM9A",
            },
            {
              tipo: "iframe",
              conteudo: "https://www.youtube.com/embed/6Rzqk-N2UF8",
              artista: "Felipe Antunes",
              titulo: "Modelo Guanabara",
              spotify: "https://www.youtube.com/watch?v=6Rzqk-N2UF8",
            },
            {
              tipo: "iframe",
              conteudo: "https://www.youtube.com/embed/ncHhc38wvp8",
              artista: "Felipe Antunes",
              titulo: "Cru",
              spotify: "https://youtu.be/ncHhc38wvp8",
            },
            {
              tipo: "iframe",
              conteudo: "https://www.youtube.com/embed/GuyfWsSQr1c",
              artista: "Vitrola Sintética",
              titulo: "Faz um Tempo",
              spotify: "https://youtu.be/GuyfWsSQr1c?si=sLVLeNVi83E9nkDQ",
            }
          ]}
        />
        
      </div>

       
    </section>
  );
};

export default VideoContainer;

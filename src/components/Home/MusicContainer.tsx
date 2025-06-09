import { motion } from 'framer-motion';
import EmblaCarousel from '../UI/SwiperCard';

const MusicContainer = () => {
  return (
    <section className="flex flex-col sm:flex-row-reverse justify-center items-center w-full bg-gradient-to-b from-black/90 to-[#0c0c0c]  py-12 px-4 sm:px-8">
      
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8 z-50"
      >
        <h1 className="font-[FrutigerBold] uppercase text-3xl sm:text-4xl text-[#c9f711]">
          Últimos Lançamentos
        </h1>
      </motion.div>

      {/* Carrossel */}
      <div className="flex w-full max-w-full sm:max-w-4xl px-0">
       

        <EmblaCarousel
          slides={[
            {
              imagem:
                "https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748863612/Capa_-_Album_Embarcação_2025_-_Felipe_Antunes-min_mif70r.jpg",
              artista: "Felipe Antunes",
              titulo: "Embarcação",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
            {
              imagem:
                "https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748863612/Capa_-_Album_Visao_Noturna_2020_-min_hym6ld.jpg",
              artista: "Felipe Antunes & Nástio Mosquito",
              titulo: "Visão Noturna",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
            {
              imagem:
                "https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748869861/500x500-000000-80-0-0_fwsw3y.jpg",
              artista: "Felipe Antunes",
              titulo: "Cru",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
            {
              imagem:
                "https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748869860/500x500-000000-80-0-0-2_ofs21x.jpg",
              artista: "Felipe Antunes",
              titulo: "Lâmina",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
          ]}
        />
      </div>

       
    </section>
  );
};

export default MusicContainer;

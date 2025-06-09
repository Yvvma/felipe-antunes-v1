import { motion } from 'framer-motion';
import EmblaCarousel from '../UI/SwiperTeather';

const TeatroContainer = () => {
  return (
    <section className="flex flex-col sm:flex-row-reverse justify-center items-center w-full bg-gradient-to-b from-black/90 to-[#0c0c0c]  py-12 px-4 sm:px-8">
      
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8 z-50"
      >
        <h1 className="font-[FrutigerBold] uppercase text-3xl sm:text-4xl text-[#c9f711]">
          Teatro
        </h1>
      </motion.div>

      {/* Carrossel */}
      <div className="flex w-full max-w-full sm:max-w-4xl px-0">
       
        <EmblaCarousel
          slides={[
            {
              imagem:
                "https://res.cloudinary.com/dsjzz8uu0/image/upload/v1749241673/MAE_CORAGEM_05.06.19_Foto_Jennifer_Glass_-_FOTOS_DO_OFICIO__HA0B5484_xqug1p.jpg",
              artista: "Mãe Coragem",
              titulo: "Bertold Brech",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
            {
              imagem:
                "https://res.cloudinary.com/dmgypxge0/image/upload/v1749057412/1720559081668da5e97a66a_1720559081_3x4_md_tbx6ip.jpg",
              artista: "Petra",
              titulo: "Rainer Fassbinder",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
            {
              imagem:
                "https://res.cloudinary.com/dmgypxge0/image/upload/v1749057412/53267497437_20912117ff_c_fw3fxc.jpg",
              artista: "Ana Livia ",
              titulo: "Caetano Galindo",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
            {
              imagem:
                "https://res.cloudinary.com/dmgypxge0/image/upload/v1749057412/medeia_ke6gki.jpg",
              artista: "Medeia",
              titulo: "Consuelo de Castro",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
            {
              imagem:
                "https://res.cloudinary.com/dsjzz8uu0/image/upload/v1749291296/FOTO_cod-madame_r9jwjx.jpg",
              artista: "Codnome Madame",
              titulo: "Tati Bueno",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
             {
              imagem:
                "https://res.cloudinary.com/dsjzz8uu0/image/upload/v1749291293/IMG_2610_xg4c8h.jpg",
              artista: "A Anfitriã",
              titulo: "Jackeline Stefanski Bernardes",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
             {
              imagem:
                "https://res.cloudinary.com/dsjzz8uu0/image/upload/v1749291293/Creditos_-Joao-Maria-Silva-Jr_.jpg_pvblxd.webp",
              artista: "A MORTA",
              titulo: "Oswald de Andreade",
              spotify:
                "https://open.spotify.com/album/7qDoqretTcO8YBI7154D8r?si=2YhSLXgSTQae0Cdzgs9RAg",
            },
            
          ]}
        />
      </div>

       
    </section>
  );
};

export default TeatroContainer;

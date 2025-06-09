import {motion} from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};



const HomeComponent = () => {
    return(
            <>
             <motion.p
                className="text-white font-[HaasRegular] tracking-normal text-sm text-left leading-5 z-20 max-w-64 sm:max-w-max"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                variants={fadeInUp}
                >
                        Nicolas Cabaneco é um artista multidisciplinar guineense-brasileiro que atua como produtor cultural e dançarino.
                        Sua carreira é marcada pela fusão entre expressões afro-diaspóricas e contemporâneas, promovendo a cultura negra
                        por meio da dança e eventos culturais. É fundador e curador da AFROGROOVE, festa que se tornou referência na cena
                        afro-urbana brasileira.
            </motion.p>
                    
          </>
    );

}; export default HomeComponent
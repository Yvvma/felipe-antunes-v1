import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BioContainer = () => {
  const [expanded, setExpanded] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const text = `Cantor, músico e compositor indicado ao Grammy Latino com sua banda Vitrola Sintética como: Melhor Artista Revelação e Engenharia de Gravação (2015); e Melhor Canção Alternativa (2016). Com a Vitrola já teve parcerias musicais como Paulo Miklos, Josyara, Roberto Mendes, Mauricio Pereira, Manoel Cordeiro, Marilina Bertoldi (Argentina) e Bárbara Eugênia. Em carreira solo lançou "Embarcação" (2025), com produção de Fabio Sá e participação de Salloma Salomão na música tema - o álbum caminha pelos universos do Soul, do Blues, do Samba e outros ritmos e experimentações em diálogo com a MPB; "Visão Noturna" (2020), projeto multilinguagem com Nástio Mosquito (Angola) que, além do álbum, traz um breve romance - na forma de livro -, e uma zine digital; "Cru" (2018) - gravado em Portugal com o violoncelista holandês Tjalle Rens e participações do rapper Xis, Lenna Bahule (Moçambique), Nástio, Oswaldo de Camargo e Kika; e "Lâmina" (2016) - participações de Ná Ozzetti, Hélio Flanders, Enzo Banzo, Juliana Perdigão e Bocato. Lançou, em 2021, com Tulipa Ruiz e Fabio Sá, o single "Água-Viva". Também é diretor musical (indicado ao Prêmio Shell de Teatro 2019 como Música) de “Mãe Coragem”, com Bete Coelho e dirigida por Daniela Thomas, "Medeia" (2021), "Gaivota" (2022), "Ana Lívia" (2023) e "Petra" (2024/25), todas com a CIABR116, de Bete, além de "A Anfitriã", de Jackeline Stefanski Bernardes, "Codinome Madame", do Núcleo Alvenaria, e "A Morta", de Oswald de Andrade, dirigida por Cacá Toledo.`;

  return (
    <section className="relative flex flex-col sm:flex-row w-full h-full p-1 bg-gradient-to-b from-[#0c0c0c] to-black overflow-hidden pb-16"
>         <div
    className="absolute inset-0 w-full h-full z-0"
    style={{
      backgroundImage: "url('https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748863616/Felipe_Antunes_1_-_Creditos_-_Rodrigo_Fonseca_1_-min_ejgsvd.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'blur(4px)', // ajustável
    }}
  />

    {/* OVERLAY COLOR (opcional, para escurecer) */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/20 to-black/60 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full justify-center items-center text-left pb-8 pt-8 z-50"
      >
        <h1 className="font-[FrutigerBold] uppercase text-4xl text-[#c9f711]">Biografia</h1>
      </motion.div>

    <div className='flex flex-col w-full h-full sm:pr-16'>
      <div className="relative w-full flex justify-center items-center pb-8"
      style={{ transform: `translateY(${offsetY * 0.2}px)` }}>
        
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1}}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="max-w-80 border border-[#c9f711] z-10 relative mb-4"
          
          src="https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748863621/Felipe_Antunes_1_-_Creditos_-_Rodrigo_Fonseca-min_q6seuz.jpg"
          alt="Felipe Antunes"
        />

        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1}}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="absolute top-0 right-0 w-32 opacity-80 z-0 border border-[#c9f711] mt-8"
          src="https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748864276/Felipe_Antunes_13_-_Creditos_-_Esher_Torres-min_enkb3y.jpg"
          alt="Decorativa 1"
        />

        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1}}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="absolute bottom-0 left-0 w-32 opacity-80 z-0 border border-[#c9f711] "
          src="https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748863619/Felipe_Antunes_2_-_Creditos_-_Rodrigo_Fonseca-min_bcbhnn.jpg"
          alt="Decorativa 2"
        />
      </div>

      {/* Bio flutuando abaixo da imagem */}
      <div className="relative z-20 flex flex-col items-center justify-center mt-2 ">
        <div className="flex flex-col justify-center items-center bg-[#0c0c0c] border border-[#c9f711] p-4 max-w-sm">
          <AnimatePresence initial={false}>
            <motion.p
              key={expanded ? 'expanded' : 'collapsed'}
              initial={{ opacity: 0, height: 0, width: 'auto'}}
              animate={{ opacity: 1, height: 'auto', width: 'auto' }}
              exit={{ opacity: 0, height: 0, width: 'auto' }}
              layout
              transition={{ duration: 0.4 }}
              className="font-[FrutigerThin] tracking-tighter text-[#c9f711] text-sm overflow-hidden mb-2"
            >
              {expanded ? text : `${text.slice(0,240)}`}
            </motion.p>
          </AnimatePresence>

          <button
            onClick={() => setExpanded(!expanded)}
            className="uppercase text-sm font-semibold font-[FrutigerRegular] text-black bg-[#c0f711] hover:bg-[#b3e300] p-2"
          >
            {expanded ? 'Mostrar menos' : 'Leia mais'}
          </button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default BioContainer;
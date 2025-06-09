import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ContactContainer = () => {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    {
      href: 'https://open.spotify.com/artist/2mr1iM8PNZjrn5DlRXJ74D',
      src: 'https://res.cloudinary.com/durf7jd0p/image/upload/v1745074235/spotify-icon_jsnycn.svg',
      alt: 'Spotify',
    },
    {
      href: 'https://music.apple.com/br/artist/felipe-antunes/521877646',
      src: 'https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748877563/apple-music_muxtcq.png',
      alt: 'Apple Music',
    },
    {
      href: 'https://www.deezer.com/br/artist/211390037',
      src: 'https://res.cloudinary.com/durf7jd0p/image/upload/v1745089618/deezer-logo_xkvan7.png',
      alt: 'Deezer',
    },
    {
      href: 'https://tidal.com/browse/artist/7958147',
      src: 'https://res.cloudinary.com/durf7jd0p/image/upload/v1745089883/tidal-svgrepo-com_irfilj.svg',
      alt: 'Tidal',
    },
    {
      href: 'https://www.youtube.com/@FelipeAntunesLamina',
      src: 'https://res.cloudinary.com/durf7jd0p/image/upload/v1745074239/youtube-svgrepo-com_obrra8.svg',
      alt: 'YouTube',
    },
  ];

  return (
    <section className="relative flex flex-col sm:flex-row w-full h-full p-1 bg-gradient-to-b from-[#0c0c0c] to-black overflow-hidden pb-16">
      {/* Background com blur */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748863690/Felipe_Antunes_12_-_Creditos_-_Esher_Torres-min_yurvbh.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(4px)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/20 to-black/60 z-0" />

      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full justify-center items-center text-left pb-8 pt-8 z-20"
      >
        <h1 className="font-[FrutigerBold] uppercase text-4xl text-[#c9f711]">Contato</h1>
      </motion.div>

      <div className="flex flex-col w-full sm:pr-16 z-10">
        {/* Parallax das imagens */}
        <div className="relative w-full flex justify-center items-center" style={{ transform: `translateY(${offsetY * 0.2 - 520}px)` }}>
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
            className="max-w-80 border border-[#c9f711] z-10 relative mb-4"
            src="https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748863631/Felipe_Antunes_7_-_Creditos_-_Rodrigo_Fonseca-min_ysux3k.jpg"
            alt="Felipe Antunes"
          />

          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
            className="absolute top-0 right-0 w-32 opacity-80 z-0 border border-[#c9f711] mt-8"
            src="https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748864276/Felipe_Antunes_13_-_Creditos_-_Esher_Torres-min_enkb3y.jpg"
            alt="Decorativa 1"
          />

          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
            className="absolute bottom-0 left-0 w-32 opacity-80 z-0 border border-[#c9f711]"
            src="https://res.cloudinary.com/dsjzz8uu0/image/upload/v1748863619/Felipe_Antunes_2_-_Creditos_-_Rodrigo_Fonseca-min_bcbhnn.jpg"
            alt="Decorativa 2"
          />
        </div>

        {/* Links e contato */}
        <div className="relative z-20 flex flex-col items-center justify-center mt-2">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: false }}
            className="flex flex-col max-w-max gap-2 p-2 border border-[#c9f711] hover:bg-[#c9f711]/10 cursor-pointer transition-colors"
          >
            <h4 className="text-[#c9f711] font-[FrutigerThin] tracking-wide uppercase text-sm text-center">
              Ouça Agora
            </h4>
            <div className="flex flex-row max-w-max gap-4 p-2">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={link.src}
                    alt={link.alt}
                    className={`max-w-5 sm:max-w-6 ${link.alt !== 'Deezer' ? 'invert' : ''}`}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contato */}
          <div className="flex flex-col justify-center items-center bg-[#0c0c0c] border border-[#c9f711] p-4 max-w-sm mt-4">
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
              className="font-[FrutigerThin] tracking-tighter text-[#c9f711] text-sm overflow-hidden text-center"
            >
              <strong>Email:</strong> contato@felipeantunes.com
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactContainer;

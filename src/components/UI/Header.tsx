import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'pt-br' | 'en-us'>('pt-br');
  const [scrolled, setScrolled] = useState(false);

  
  const menuItems = [
    { label: 'Home', path: 'https://www.felipeantunes.com' },
    { label: 'Musica', path: 'https://www.felipeantunes.com/musica' },
    { label: 'Videos', path: 'https://www.felipeantunes.com/videos' },
    { label: 'Teatro', path: 'https://www.felipeantunes.com/teatro' },
    { label: 'Loja', path: '/' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Header */}
      <motion.header
      className="fixed top-0 left-0 w-full z-50"
      animate={{
        backgroundColor: 'rgba(0,0,0,0)', // sempre transparente, sem cor
        backdropFilter: scrolled ? 'blur(8px)' : 'blur(0px)'
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <motion.nav
        className="w-full mx-auto flex px-8 sm:px-32 justify-between items-center"
        animate={{
          paddingTop: isSidebarOpen || isLanguageMenuOpen ? 48 : scrolled ? 12 : 48, // menor altura no scroll
          paddingBottom: 16,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
          {/* Logo */}
          <a href='/'>
            <div className="flex flex-row gap-2 items-center justify-center">
              <h1 className='font-[FrutigerBlack] text-[#c9f711] uppercase text-xl'>Felipe Antunes</h1>
            </div>
          </a>

          <div className="flex-col sm:flex-row gap-4 hidden md:block">
            {menuItems.map((item, index) => {
              return (
                <motion.a
                  key={item.label}
                  href={item.path}
                  className="text-white text-lg font-[FrutigerBold] text-center uppercase tracking-tight px-4 py-2 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                </motion.a>
              );
            })}
          </div>

          {/* Botões do lado direito */}
          <div className="flex flex-row gap-6 items-center">
        
            {/* Botão Menu */}
            <button
              onClick={() => {
                setIsLanguageMenuOpen(false);
                setIsSidebarOpen(!isSidebarOpen);
              }}
              className="relative w-8 h-8 flex items-center justify-center  z-30 sm:hidden "
              aria-label="Toggle menu"
            >
              <motion.span
                className="absolute w-6 h-0.5 bg-white"
                animate={{
                  rotate: isSidebarOpen ? 45 : 0,
                  y: isSidebarOpen ? 0 : -6,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="absolute w-6 h-0.5 bg-white"
                animate={{
                  rotate: isSidebarOpen ? -45 : 0,
                  y: isSidebarOpen ? 0 : 6,
                }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* Menu Principal */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-0 left-0 w-full h-full flex flex-col z-40 items-center justify-center gap-32 backdrop-blur"
          >
            
            <div className='flex flex-col gap-8'>
              <hr className="border-t border-white my-8 w-full" />
              <div className='flex flex-col sm:flex-row gap-8'>
                {menuItems.map((item, index) => {
                  return (
                    <motion.a
                      key={item.label}
                      href={item.path}
                      className="text-white text-xl font-[FrutigerBold] text-center uppercase tracking-wide px-4 py-2 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{scale: 0.95}}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.label}
                    </motion.a>
                  );
                })}
              </div>

              <hr className="border-t border-white my-8 w-full" />

              <div className='flex flex-row justify-center items-center sm:flex-row gap-8 text-white'>
                
                  <h1 className='font-[FrutigerBold] text-[#c9f711] uppercase text-xl'>FA</h1>
      
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default HeaderComponent;

import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AccordionProps = {
    children: ReactNode; 
  };
  

const AccordionItem = ({ children }:AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/20 py-4 w-full items-center justify-center sm:justify-start">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-center items-center p-4"
      >
      <AnimatePresence mode="wait">

        <motion.h3
          whileTap={{scale:0.95}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`text-white font-[HaasLight] uppercase text-xl tracking-normal border-white ${isOpen ? 'border-white p-2' : 'border border-transparent p-2 hover:border-white'}`}
        >
          BIOGRAFIA
        </motion.h3>

      </AnimatePresence>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="text-white text-2xl"
        >
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden "
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AccordionItem;
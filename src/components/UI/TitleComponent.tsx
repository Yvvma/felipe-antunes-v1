import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

interface TitleProp {
  title: string;
  currentPath: string; // <- recebe o path
}

const TitleComponent = ({ title, currentPath }: TitleProp) => {
  return (
    <div className="flex flex-col sm:flex-row w-full justify-center items-center sm:justify-between sm:items-end pl-4 pr-4 gap-4">
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeInUp}
        className="p-2"
      >
        <h1 className="text-[#c9f711] font-[FrutigerThin] tracking-wide uppercase text-2xl">
          {title}
        </h1>
      </motion.div>
    </div>
  );
};

export default TitleComponent;
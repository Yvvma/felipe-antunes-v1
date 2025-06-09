import { useState, useEffect } from "react";
import { motion } from "framer-motion";


const FooterComponent = () => {
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <footer className="flex flex-col w-full justify-center items-center bg-black pt-8 pb-8">


      {/* Logo e copyright */}
      <div className="text-white gap-8 text-sm font-medium justify-center items-center flex flex-col sm:justify-between sm:flex-row w-full max-w-6xl px-8">
       <a href='/'>
            <div className="flex flex-row items-center justify-center">
              <h1 className='font-[FrutigerBold] text-[#c9f711] uppercase text-xl'>Felipe Antunes</h1>
            </div>
          </a>

        <p className="font-[FrutigerThin] tracking-tight uppercase text-center text-sm text-gray-100 sm:mt-0">
          © 2025 Industriebrasil.com.br
        </p>
      </div>

    </footer>
  );
};
export default FooterComponent;

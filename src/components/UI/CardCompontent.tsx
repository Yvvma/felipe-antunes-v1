import React from 'react';

interface CardProps {
  imagem: string;
  titulo: string;
  logo?: string; // logo é opcional
}

const CardComponent: React.FC<CardProps> = ({ imagem, titulo, logo }) => {
  return (
    <div className="relative w-full h-64 overflow-hidden rounded-xl shadow-lg">

      {/* Sobreposição e conteúdo */}
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
        {logo && (
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 object-contain mb-2"
          />
        )}
        <h2 className="text-lg font-[AffigereRegular] tracking-wide uppercase">
          {titulo}
        </h2>
      </div>

       <img
        src={imagem}
        alt={titulo}
        className="w-full h-64 object-cover"
      />

    </div>
  );
};

export default CardComponent;

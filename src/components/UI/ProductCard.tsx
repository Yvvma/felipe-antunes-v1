import React from "react";
import { useCart } from "../context/CartContext";

type Product = {
  name: string;
  price: number;
  image: string;
  slug: string;
};

export default function ProductCard({ name, price, image, slug }: Product) {
  const { addToCart } = useCart();

  return (
    <div className="block group">
      <div className="flex flex-col justify-center items-center gap-4 border border-[#c9f711] p-4 bg-black rounded shadow-lg transition hover:scale-[1.02] h-full w-full">
        <a href={`/produto/${slug}`} aria-label={`Ver detalhes do produto ${name}`} className="w-full aspect-square overflow-hidden rounded block">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </a>
        <div className="flex flex-col justify-center items-center text-center gap-2">
          <h4 className="font-[FrutigerBlack] uppercase text-lg sm:text-2xl text-[#c9f711]">
            {name}
          </h4>
          <p className="font-[FrutigerRegular] text-sm sm:text-base text-white">
            R$ {price.toFixed(2)}
          </p>
          <button
            onClick={() => addToCart({ name, price, image, slug })}
            className="uppercase text-xs sm:text-sm font-semibold font-[FrutigerRegular] text-black bg-[#c0f711] hover:bg-[#b3e300] px-4 py-2 transition"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

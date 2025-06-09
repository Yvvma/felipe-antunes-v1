import React from "react";
import { useCart } from "../context/CartContext";

type Product = {
  name: string;
  price: number;
  image: string;
  slug: string;
  description?: string;
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
};

export default function ProductPage({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-black text-white pt-8">
      <div className="max-w-4xl w-full flex flex-col sm:flex-row gap-8 border border-[#c9f711] p-6 rounded shadow-lg">
        <div className="w-full sm:w-1/2 aspect-square overflow-hidden rounded">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>

        <div className="w-full sm:w-1/2 flex flex-col gap-4 justify-center items-start text-left">
          <h1 className="text-[#c9f711] font-[FrutigerBlack] text-3xl sm:text-4xl uppercase">
            {product.name}
          </h1>
          <p className="font-[FrutigerRegular] text-xl sm:text-2xl">
            R$ {product.price.toFixed(2)}
          </p>

          {product.description && (
            <p className="text-sm sm:text-base font-[FrutigerRegular] text-white/80 leading-relaxed">
              {product.description}
            </p>
          )}

          <button
            onClick={() => addToCart(product)}
            className="uppercase text-sm font-semibold font-[FrutigerRegular] text-black bg-[#c0f711] hover:bg-[#b3e300] px-6 py-3 transition"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

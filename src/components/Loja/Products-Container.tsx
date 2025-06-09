import React from "react";
import ProductCard from "../UI/ProductCard";

type Product = {
  name: string;
  price: number;
  image: string;
  slug: string;
};

type Props = {
  products: Product[];
};

export default function ProductsContainer({ products }: Props) {
  return (
    <section className="w-full  bg-black p-32">
      <h2 className="text-[#c9f711] text-2xl sm:text-3xl font-[FrutigerBlack] uppercase mb-6 text-center">
        Produtos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}
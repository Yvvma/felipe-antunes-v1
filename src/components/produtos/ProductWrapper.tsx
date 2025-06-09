import React from "react";
import { CartProvider } from "../context/CartContext";
import ProductPage from "../Loja/ProductPage";
import CartBar from "../UI/CartBar";

export default function ProductWrapper({ product }:any) {
  return (
    
      <div className="w-full flex flex-col items-center justify-center p-4">
        <CartProvider>
        <ProductPage product={product} />
        <CartBar />
        </CartProvider>
      </div>
    
  );
}

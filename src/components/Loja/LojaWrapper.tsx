import React from "react";
import { CartProvider } from "../context/CartContext";
import ProductsContainer from "./Products-Container";
import { Products } from "../../data/Products";
import CartBar from "../UI/CartBar";

export default function LojaWrapper({ currentPath }: { currentPath: string }) {
  return (
    <CartProvider>
      <div className="relative w-full overflow-x-hidden flex justify-center items-center">
        {/* Main content */}
        
          <ProductsContainer products={Products} />
        
        
       
          <CartBar />
        
      </div>
    </CartProvider>
  );
}
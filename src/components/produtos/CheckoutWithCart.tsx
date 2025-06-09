import React from 'react';
import { CartProvider } from '../context/CartContext';
import MercadoPagoForm from '../Loja/MercadoPagoForm';

export default function CheckoutWithCartProvider() {
  return (
    <CartProvider>
      <MercadoPagoForm />
    </CartProvider>
  );
}

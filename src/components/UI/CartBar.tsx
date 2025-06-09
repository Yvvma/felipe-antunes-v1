import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartBar() {
  const { cart, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(true);

  if (!cart) return null;

  // Safely calculate totals
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="cart"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mx-auto max-w-2xl w-full px-4 pb-4 pointer-events-auto"
          >
            <div className="w-full bg-black border border-[#c9f711] rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <motion.div
                className="flex justify-between items-center px-6 py-4 border-b border-[#333]"
              >
                <div>
                  <p className="font-[FrutigerBlack] text-[#c9f711] uppercase text-lg">Carrinho</p>
                  <p className="text-sm font-[FrutigerRegular] text-[#c9f711]">
                    {totalItems} {totalItems === 1 ? "item" : "itens"} - R$ {totalPrice.toFixed(2)}
                  </p>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[#c9f711] text-3xl font-bold"
                >
                  −
                </motion.button>
              </motion.div>

              {/* Content */}
              <motion.div
                className="p-6 max-h-96 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {cart.length === 0 ? (
                  <p className="text-center text-white font-[FrutigerRegular]">Seu carrinho está vazio.</p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                  >
                    {cart.map((item) => (
                      <motion.div
                        key={item.slug}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex justify-between items-center mb-4 border-b border-[#333] pb-2"
                      >
                        <div className="flex items-center gap-4">
                          {item.image && (
                            <motion.img
                              src={item.image}
                              alt={item.name || "Produto"}
                              className="w-16 h-16 object-cover rounded border border-[#c9f711]"
                              whileHover={{ scale: 1.03 }}
                            />
                          )}
                          <div>
                            <p className="font-[FrutigerBlack] text-[#c9f711]">{item.name || "Produto"}</p>
                            <p className="text-white font-[FrutigerRegular] text-sm">
                              {item.quantity || 0} x R$ {(item.price || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => removeFromCart(item.slug)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-[#c9f711] text-2xl font-bold"
                        >
                          ×
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Footer */}
              {cart.length > 0 && (
                <motion.div
                  className="px-6 pb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => (window.location.href = '/checkout')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#c9f711] hover:bg-[#b3e300] text-black font-[FrutigerBlack] uppercase py-3 rounded"
                  >
                    Finalizar Compra
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 bg-black border border-[#c9f711] rounded-xl shadow-lg text-[#c9f711] font-[FrutigerBlack] uppercase text-xl h-14 w-20 flex items-center justify-center pointer-events-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + {totalItems > 0 && <span className="ml-1 text-sm">({totalItems})</span>}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
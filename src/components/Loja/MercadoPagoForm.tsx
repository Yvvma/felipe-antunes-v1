import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface ShippingOption {
  id: number;
  name: string;
  price: string;
  delivery_time: number;
  company: {
    name: string;
    picture: string;
  };
}

export default function MercadoPagoCheckout() {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | null>(null);
  const [mp, setMp] = useState<any>(null);
  const [pixCode, setPixCode] = useState("");
  const [pixQrCode, setPixQrCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const cardPaymentBrickController = useRef<any>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = selectedShipping ? parseFloat(selectedShipping.price) : 0;
  const totalPrice = subtotal + shippingPrice;

  useEffect(() => {
    if (window.MercadoPago) {
      initializeMercadoPago();
    } else {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.addEventListener("load", () => {
        initializeMercadoPago();
      });
      document.body.appendChild(script);
    }

    return () => {
      if (cardPaymentBrickController.current) {
        cardPaymentBrickController.current.unmount();
      }
    };
  }, []);

  const initializeMercadoPago = () => {
    const mercadoPago = new window.MercadoPago(import.meta.env.PUBLIC_MP_PUBLIC_KEY, {
      locale: 'pt-BR'
    });
    setMp(mercadoPago);
  };

  useEffect(() => {
    if (mp && paymentMethod === "card" && totalPrice > 0) {
      initializeCardPaymentBrick();
    }
  }, [mp, paymentMethod, totalPrice, selectedShipping]);

  const calculateShipping = async () => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      setShippingError("CEP inválido");
      return;
    }

    setShippingLoading(true);
    setShippingError("");
    
    try {
      const response = await fetch("/api/calculate-shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postalCode: cep,
          products: cart.map(item => ({
            width: item.width || 20,
            height: item.height || 10,
            length: item.length || 30,
            weight: item.weight || 0.5,
            quantity: item.quantity,
            price: item.price
          }))
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setShippingOptions(data);
        if (data.length > 0) {
          setSelectedShipping(data[0]);
        }
      } else {
        throw new Error(data.error || "Erro ao calcular frete");
      }
    } catch (err: any) {
      setShippingError(err.message);
    } finally {
      setShippingLoading(false);
    }
  };

  const initializeCardPaymentBrick = () => {
    if (cardPaymentBrickController.current) {
      cardPaymentBrickController.current.unmount();
    }

    const bricksBuilder = mp.bricks();
    
    const renderCardPaymentBrick = async (bricksBuilder: any) => {
      const settings = {
        initialization: {
          amount: totalPrice,
          payer: {
            email: email || undefined,
          },
        },
        customization: {
          visual: {
            style: {
              theme: 'dark',
              customVariables: {
                formBackgroundColor: '#171717',
                baseColor: '#c9f711',
                inputBackgroundColor: '#262626',
                inputBorderColor: '#404040',
                inputFocusedBorderColor: '#c9f711',
                inputErrorBorderColor: '#f87171',
                inputTextColor: '#ffffff',
                inputPlaceholderColor: '#9ca3af',
                inputFocusedTextColor: '#ffffff',
                labelTextColor: '#d1d5db',
                errorColor: '#f87171',
                outlinePrimary: '#c9f711',
              },
            },
          },
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
          },
        },
        callbacks: {
          onReady: () => {
            // Handle onReady
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            setLoading(true);
            setError("");
            
            try {
              const response = await fetch("/api/process_payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  token: formData.token,
                  payment_method_id: formData.payment_method_id,
                  issuer_id: formData.issuer_id,
                  installments: formData.installments,
                  email: email,
                  payment_type: selectedPaymentMethod,
                  cart,
                  shipping: selectedShipping,
                  total: totalPrice
                }),
              });

              const result = await response.json();
              
              if (result.status === "approved") {
                setSuccess(true);
                clearCart();
              } else {
                throw new Error(result.message || "Pagamento não aprovado");
              }
            } catch (err: any) {
              setError(err.message || "Erro no processamento do pagamento");
            } finally {
              setLoading(false);
            }
          },
          onError: (error: any) => {
            setError(error.message || "Erro no formulário de pagamento");
          },
        },
      };

      cardPaymentBrickController.current = await bricksBuilder.create(
        'cardPayment',
        'cardPaymentBrick_container',
        settings
      );
    };

    renderCardPaymentBrick(bricksBuilder);
  };

  const handlePixPayment = async () => {
    setLoading(true);
    setError("");
    
    try {
      const pixTotal = totalPrice * 0.99; // 1% discount for Pix
      
      const response = await fetch("/api/process_payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: "pix",
          email,
          cart,
          shipping: selectedShipping,
          total: pixTotal
        }),
      });

      const result = await response.json();
      
      if (result.point_of_interaction) {
        setPixCode(result.point_of_interaction.transaction_data.qr_code);
        setPixQrCode(result.point_of_interaction.transaction_data.qr_code_base64);
        setPaymentStatus("pending");
        setPaymentId(result.id);
        
        // Verifica status do pagamento periodicamente
        const checkPaymentStatus = setInterval(async () => {
          const statusResponse = await fetch(`/api/payment_status?id=${result.id}`);
          const statusData = await statusResponse.json();
          
          if (statusData.status === "approved") {
            clearInterval(checkPaymentStatus);
            setSuccess(true);
            clearCart();
          }
        }, 5000);
      } else {
        throw new Error("Falha ao gerar código Pix");
      }
    } catch (err: any) {
      setError(err.message || "Erro no processamento do Pix");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center p-8 bg-black text-white rounded-lg border border-[#c9f711]">
        <h2 className="text-2xl font-bold text-[#c9f711] mb-4">Carrinho vazio</h2>
        <p className="mb-4">Adicione produtos ao carrinho para continuar.</p>
        <a href="/" className="text-[#c9f711] hover:underline">Voltar para a loja</a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center p-8 bg-black text-white rounded-lg border border-[#c9f711]">
        <div className="text-[#c9f711] text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-[#c9f711] mb-4">Pagamento Aprovado!</h2>
        <p className="mb-6">Obrigado por sua compra! Você receberá um e-mail com os detalhes.</p>
        <a
          href="/"
          className="bg-[#c9f711] text-black font-bold uppercase px-6 py-3 rounded hover:bg-[#b3e300] transition"
        >
          Continuar Comprando
        </a>
      </div>
    );
  }

  if (paymentStatus === "pending" && paymentMethod === "pix") {
    return (
      <div className="max-w-lg mx-auto p-4 bg-black text-white rounded-lg border border-[#c9f711]">
        <h2 className="text-2xl font-bold text-[#c9f711] mb-6">Pagamento via Pix</h2>
        
        <div className="text-center mb-6">
          <p className="mb-4">Escaneie o QR Code ou copie o código abaixo:</p>
          {pixQrCode && (
            <img 
              src={`data:image/png;base64,${pixQrCode}`} 
              alt="QR Code Pix" 
              className="mx-auto mb-4 w-48 h-48"
            />
          )}
          <div className="bg-gray-800 p-3 rounded mb-4">
            <p className="text-sm font-mono break-all">{pixCode}</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(pixCode)}
            className="text-[#c9f711] text-sm hover:underline"
          >
            Copiar código
          </button>
        </div>

        <div className="bg-gray-900 p-4 rounded border border-[#c9f711]/30">
          <h3 className="font-bold text-[#c9f711] mb-2">Instruções:</h3>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Abra seu app de pagamentos</li>
            <li>Selecione pagar via Pix</li>
            <li>Escaneie o QR Code ou cole o código</li>
            <li>Confirme o pagamento</li>
          </ol>
        </div>

        <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-center">
          <p className="text-yellow-400">Aguardando confirmação do pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black text-white rounded-lg border border-[#c9f711]">
      <h2 className="text-2xl font-bold text-[#c9f711] mb-6">Finalizar Compra</h2>
      
      

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-900 rounded border border-[#c9f711]/30">
        <h3 className="font-bold text-[#c9f711] mb-3">Resumo do Pedido</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.quantity} x {item.name}</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        
        {selectedShipping && (
          <div className="flex justify-between items-center mb-2">
            <span>Frete ({selectedShipping.company.name})</span>
            <span>R$ {parseFloat(selectedShipping.price).toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-[#c9f711]/30 pt-2 mt-2">
          <div className="flex justify-between font-bold text-[#c9f711] text-lg">
            <span>Total:</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      
      {/* Shipping Calculation */}
      <div className="mb-6 p-4 bg-gray-900 rounded border border-[#c9f711]/30">
        <h3 className="font-bold text-[#c9f711] mb-3">Calcular Frete</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium mb-1">CEP</label>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
              placeholder="00000-000"
              maxLength={9}
              className="w-full p-3 bg-gray-800 border border-[#c9f711] rounded text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={calculateShipping}
              disabled={shippingLoading || cep.length < 8}
              className="bg-[#c9f711] text-black font-bold px-6 py-3 rounded hover:bg-[#b3e300] transition disabled:opacity-50"
            >
              {shippingLoading ? "Calculando..." : "Calcular Frete"}
            </button>
          </div>
        </div>
        
        {shippingError && (
          <div className="mt-2 text-red-400 text-sm">{shippingError}</div>
        )}

        {shippingOptions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Opções de Frete:</h4>
            <div className="space-y-2">
              {shippingOptions.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => setSelectedShipping(option)}
                  className={`p-3 rounded border cursor-pointer transition ${
                    selectedShipping?.id === option.id 
                      ? 'border-[#c9f711] bg-[#c9f711]/10' 
                      : 'border-gray-700 hover:border-[#c9f711]/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{option.company.name}</div>
                      <div className="text-sm text-gray-400">
                        {option.delivery_time} dia(s) útil(eis)
                      </div>
                    </div>
                    <div className="font-bold text-[#c9f711]">
                      R$ {parseFloat(option.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!paymentMethod ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Selecione a forma de pagamento:</h3>
          
          <button
            onClick={() => setPaymentMethod("pix")}
            disabled={!selectedShipping}
            className={`w-full flex items-center justify-between p-4 rounded border transition ${
              selectedShipping 
                ? 'bg-gray-800 hover:bg-gray-700 border-transparent hover:border-[#c9f711]' 
                : 'bg-gray-800/50 border-gray-700 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center">
              <div className="bg-[#c9f711] text-black p-2 rounded mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M2 10h20"></path>
                  <path d="M7 14h.01"></path>
                  <path d="M11 14h.01"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-bold">Pix</h4>
                <p className="text-sm text-gray-400">Pagamento instantâneo com 1% de desconto</p>
              </div>
            </div>
            <span className="text-[#c9f711] font-bold">R$ {(totalPrice * 0.99).toFixed(2)}</span>
          </button>

          <button
            onClick={() => setPaymentMethod("card")}
            disabled={!selectedShipping}
            className={`w-full flex items-center justify-between p-4 rounded border transition ${
              selectedShipping 
                ? 'bg-gray-800 hover:bg-gray-700 border-transparent hover:border-[#c9f711]' 
                : 'bg-gray-800/50 border-gray-700 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center">
              <div className="bg-[#c9f711] text-black p-2 rounded mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <div>
                <h4 className="font-bold">Cartão de Crédito/Débito</h4>
                <p className="text-sm text-gray-400">Pague com Visa, Mastercard, Elo e outros</p>
              </div>
            </div>
            <span className="text-[#c9f711] font-bold">R$ {totalPrice.toFixed(2)}</span>
          </button>

          {!selectedShipping && (
            <div className="text-center text-yellow-400 text-sm mt-2">
              Selecione uma opção de frete antes de escolher o pagamento
            </div>
          )}
        </div>
      ) : paymentMethod === "pix" ? (
        <div className="space-y-4">
          <button
            onClick={() => setPaymentMethod(null)}
            className="flex items-center text-[#c9f711] hover:underline mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar para opções de pagamento
          </button>

          

          <div>
            <label className="block text-sm font-medium mb-1">E-mail para receber o comprovante</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 border border-[#c9f711] rounded text-white"
              placeholder="seu@email.com"
            />
          </div>

          <button
            onClick={handlePixPayment}
            disabled={loading || !email}
            className="w-full bg-[#c9f711] text-black font-bold uppercase py-3 rounded hover:bg-[#b3e300] transition disabled:opacity-50 mt-4"
          >
            {loading ? "Gerando QR Code..." : `Pagar R$ ${(totalPrice * 0.99).toFixed(2)} via Pix`}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setPaymentMethod(null)}
            className="flex items-center text-[#c9f711] hover:underline mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar para opções de pagamento
          </button>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 border border-[#c9f711] rounded text-white"
              placeholder="seu@email.com"
            />
          </div>

          {/* Card Payment Brick Container */}
          <div id="cardPaymentBrick_container" className="mt-4"></div>
        </div>
      )}
      

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded">
          <p className="text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
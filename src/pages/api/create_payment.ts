// src/pages/api/create_payment.ts - Fixed MercadoPago API integration
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { cart, email } = await request.json();

    // Enhanced validation
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return new Response(
        JSON.stringify({ error: "Carrinho vazio ou inválido" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Email inválido" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate access token
    const accessToken = import.meta.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('MercadoPago access token not configured');
      return new Response(
        JSON.stringify({ error: "Configuração de pagamento inválida" }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate and map items to MercadoPago format
    const items = cart.map((item: any, index: number) => {
      // Validate required fields
      if (!item.name || !item.price || !item.quantity) {
        throw new Error(`Item ${index + 1} está incompleto`);
      }

      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (isNaN(price) || price <= 0) {
        throw new Error(`Preço inválido no item ${index + 1}`);
      }

      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Quantidade inválida no item ${index + 1}`);
      }

      return {
        title: String(item.name).substring(0, 256), // MercadoPago title limit
        quantity: quantity,
        unit_price: price,
        currency_id: "BRL",
      };
    });

    // Get origin URL properly
    const origin = new URL(request.url).origin;

    // Preference body with proper structure
    const preferenceData = {
      items,
      payer: {
        email: email,
      },
      back_urls: {
        success: `${origin}/sucesso`,
        failure: `${origin}/falha`,
        pending: `${origin}/pendente`,
      },
      auto_return: "approved",
      notification_url: `${origin}/api/webhooks/mercadopago`,
      statement_descriptor: "Felipe Antunes",
      external_reference: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      // Additional recommended settings
      binary_mode: false,
      marketplace: "NONE",
    };

    console.log('Creating MercadoPago preference with data:', JSON.stringify(preferenceData, null, 2));

    // Make direct API call to MercadoPago
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      body: JSON.stringify(preferenceData),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('MercadoPago API error:', {
        status: mpResponse.status,
        statusText: mpResponse.statusText,
        data: mpData
      });
      
      // Handle specific MercadoPago errors
      let errorMessage = "Erro ao criar pagamento";
      if (mpData.message) {
        errorMessage = mpData.message;
      } else if (mpData.cause && mpData.cause.length > 0) {
        errorMessage = mpData.cause[0].description || mpData.cause[0].code;
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: mpData
        }), 
        { 
          status: mpResponse.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate response structure
    if (!mpData.init_point || !mpData.id) {
      console.error('Invalid MercadoPago response structure:', mpData);
      return new Response(
        JSON.stringify({ 
          error: "Resposta inválida do servidor de pagamento" 
        }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log('MercadoPago preference created successfully:', {
      preference_id: mpData.id,
      init_point: mpData.init_point
    });

    return new Response(
      JSON.stringify({ 
        init_point: mpData.init_point,
        preference_id: mpData.id,
        sandbox_init_point: mpData.sandbox_init_point // Include sandbox URL if available
      }), 
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error: any) {
    console.error('MercadoPago integration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Don't expose internal errors to client
    const publicError = error.message?.includes('Item') || error.message?.includes('inválid') 
      ? error.message 
      : "Erro interno do servidor";

    return new Response(
      JSON.stringify({ 
        error: publicError
      }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
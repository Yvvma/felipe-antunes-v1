// src/pages/api/create_preference.ts
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
      if (!item.name || item.price === undefined || item.quantity === undefined) {
        throw new Error(`Item ${index + 1} está incompleto - nome, preço e quantidade são obrigatórios`);
      }

      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (isNaN(price) || price <= 0) {
        throw new Error(`Preço inválido no item "${item.name}" - deve ser um número maior que zero`);
      }

      if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        throw new Error(`Quantidade inválida no item "${item.name}" - deve ser um número inteiro maior que zero`);
      }

      return {
        title: String(item.name).substring(0, 256), // MercadoPago title limit
        quantity: quantity,
        unit_price: price,
        currency_id: "BRL",
      };
    });

    // Calculate total for validation
    const totalAmount = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    
    if (totalAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "Valor total do pedido deve ser maior que zero" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get origin URL properly
    const origin = new URL(request.url).origin;

    // Generate unique external reference
    const externalReference = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Preference data with proper structure
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
      external_reference: externalReference,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      binary_mode: false,
      marketplace: "NONE",
      // Additional metadata
      metadata: {
        created_at: new Date().toISOString(),
        total_items: items.length,
        total_amount: totalAmount
      }
    };

    console.log('Creating MercadoPago preference:', {
      external_reference: externalReference,
      items_count: items.length,
      total_amount: totalAmount,
      payer_email: email
    });

    // Make API call to MercadoPago with idempotency
    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(preferenceData),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('MercadoPago API error:', {
        status: mpResponse.status,
        statusText: mpResponse.statusText,
        response: mpData,
        request_data: preferenceData
      });
      
      // Handle specific MercadoPago error responses
      let errorMessage = "Erro ao criar preferência de pagamento";
      
      if (mpData.message) {
        errorMessage = mpData.message;
      } else if (mpData.cause && Array.isArray(mpData.cause) && mpData.cause.length > 0) {
        const cause = mpData.cause[0];
        errorMessage = cause.description || cause.code || errorMessage;
      } else if (mpData.error) {
        errorMessage = mpData.error;
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          ...(process.env.NODE_ENV === 'development' && { details: mpData })
        }), 
        { 
          status: mpResponse.status >= 400 && mpResponse.status < 500 ? mpResponse.status : 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate response structure
    if (!mpData.id) {
      console.error('Invalid MercadoPago response - missing preference ID:', mpData);
      return new Response(
        JSON.stringify({ 
          error: "Resposta inválida do servidor de pagamento - ID da preferência não encontrado" 
        }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log('MercadoPago preference created successfully:', {
      preference_id: mpData.id,
      external_reference: externalReference,
      init_point: mpData.init_point || 'not provided',
      sandbox_init_point: mpData.sandbox_init_point || 'not provided'
    });

    // Return preference data
    const responseData: any = {
      preference_id: mpData.id,
      external_reference: externalReference
    };

    // Include URLs if available
    if (mpData.init_point) {
      responseData.init_point = mpData.init_point;
    }
    
    if (mpData.sandbox_init_point) {
      responseData.sandbox_init_point = mpData.sandbox_init_point;
    }

    return new Response(
      JSON.stringify(responseData), 
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error: any) {
    console.error('MercadoPago preference creation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Determine if error should be exposed to client
    const isValidationError = error.message?.includes('Item') || 
                             error.message?.includes('inválid') ||
                             error.message?.includes('obrigatórios');
    
    const publicError = isValidationError ? error.message : "Erro interno do servidor";

    return new Response(
      JSON.stringify({ 
        error: publicError
      }), 
      { 
        status: isValidationError ? 400 : 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
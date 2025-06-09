// src/pages/api/process_payment.ts
import type { APIRoute } from 'astro';

const sanitizeAmount = (value: any): number => {
  const numberValue = typeof value === 'string' 
    ? parseFloat(value.replace(',', '.'))
    : Number(value);
  
  if (isNaN(numberValue) || numberValue <= 0) {
    throw new Error('Valor da transação inválido');
  }
  
  return Math.round(numberValue * 100) / 100;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { 
      token, 
      email, 
      payment_method, 
      payment_method_id,
      issuer_id,
      installments,
      cart, 
      total 
    } = body;

    const transactionAmount = sanitizeAmount(total);
    const MP_ACCESS_TOKEN = import.meta.env.MP_ACCESS_TOKEN;
    
    if (!MP_ACCESS_TOKEN) {
      return new Response(JSON.stringify({
        error: 'Configuração faltando',
        message: 'Token de acesso ao Mercado Pago não configurado'
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Base payment data
    const basePaymentData = {
      transaction_amount: transactionAmount,
      description: `Compra na loja - ${cart.map((item: any) => item.name).join(', ').slice(0, 200)}`,
      payer: { 
        email: email || 'test@example.com'
      },
      external_reference: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    let paymentData;

    if (payment_method === 'pix') {
      // PIX Configuration
      paymentData = {
        ...basePaymentData,
        payment_method_id: 'pix',
        date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
    } else {
      // Card Configuration
      if (!token) {
        return new Response(JSON.stringify({
          error: 'Token do cartão obrigatório'
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      paymentData = {
        ...basePaymentData,
        token: token,
        payment_method_id: payment_method_id || 'visa',
        installments: installments || 1,
        ...(issuer_id && { issuer_id: issuer_id })
      };
    }

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        error: 'Falha no pagamento',
        message: result.message || 'Erro no processamento do pagamento',
        details: result.cause?.map((c: any) => c.description) || []
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const responseData: any = {
      success: true,
      id: result.id,
      status: result.status,
      status_detail: result.status_detail
    };

    // Add PIX data if applicable
    if (payment_method === 'pix' && result.point_of_interaction) {
      responseData.point_of_interaction = {
        transaction_data: {
          qr_code: result.point_of_interaction.transaction_data.qr_code,
          qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64
        }
      };
    }

    return new Response(JSON.stringify(responseData), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(JSON.stringify({
      error: 'Erro no servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
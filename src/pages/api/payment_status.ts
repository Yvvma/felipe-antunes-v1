// api/payment_status.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  try {
    const paymentId = url.searchParams.get('id');
    
    if (!paymentId) {
      return new Response(JSON.stringify({ error: 'ID do pagamento é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const MP_ACCESS_TOKEN = import.meta.env.MP_ACCESS_TOKEN;
    
    if (!MP_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: 'Token de acesso não configurado' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Erro ao consultar status:', result);
      return new Response(JSON.stringify({ 
        error: 'Erro ao consultar status do pagamento',
        details: result 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      transaction_amount: result.transaction_amount,
      date_created: result.date_created,
      date_approved: result.date_approved
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro na consulta de status:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
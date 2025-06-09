import type { APIRoute } from 'astro';

// Environment variables
const ORIGIN_POSTAL_CODE = process.env.ORIGIN_POSTAL_CODE || "12904290";
const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN;

export const POST: APIRoute = async ({ request }) => {
  console.log('Origin postal code:', ORIGIN_POSTAL_CODE);
  
  try {
    if (!MELHOR_ENVIO_TOKEN) {
      console.error('Personal access token not found in environment variables');
      return new Response(JSON.stringify({ 
        error: 'Melhor Envio personal access token not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { postalCode, products } = await request.json();

    if (!postalCode || !products || !Array.isArray(products) || products.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'postalCode and products are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate postal codes format
    const cleanOriginPostalCode = ORIGIN_POSTAL_CODE.replace(/\D/g, '');
    const cleanDestinationPostalCode = postalCode.replace(/\D/g, '');
    
    if (cleanOriginPostalCode.length !== 8 || cleanDestinationPostalCode.length !== 8) {
      return new Response(JSON.stringify({
        error: 'Invalid postal code format. Must be 8 digits.',
        origin: cleanOriginPostalCode,
        destination: cleanDestinationPostalCode
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validatedProducts = products.map((p: any, index: number) => {
      // Melhor Envio has minimum requirements
      return {
        id: index.toString(),
        width: Math.max(p.width || 20, 11), // Minimum 11cm
        height: Math.max(p.height || 10, 2), // Minimum 2cm
        length: Math.max(p.length || 30, 16), // Minimum 16cm
        weight: Math.max(p.weight || 0.5, 0.3), // Minimum 300g
        insurance_value: p.price || 17.00,
        quantity: p.quantity || 1,
      };
    });

    // Calculate total declared value (minimum R$ 17.00)
    const declaredValue = Math.max(
      products.reduce((acc, p) => acc + (p.price || 17) * (p.quantity || 1), 0),
      17
    );

    const payload = {
      from: {
        postal_code: cleanOriginPostalCode
      },
      to: {
        postal_code: cleanDestinationPostalCode
      },
      products: validatedProducts,
      options: {
        insurance_value: declaredValue,
        receipt: false,
        own_hand: false,
        reverse: false,
        non_commercial: true,
        platform: 'Your Store Name',
      },
      services: '1,2,3,4' // Optional: specify which services you want to calculate
    };

    console.log('Payload for Melhor Envio:', JSON.stringify(payload, null, 2));

    const endpoint = 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Aplicacao/1.0'
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(`API Response from ${endpoint}:`, JSON.stringify(data, null, 2));

    if (response.ok) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
      });
    } else {
      console.error(`Error from ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        data,
      });

      // Enhanced error handling
      if (response.status === 401) {
        return new Response(JSON.stringify({
          error: 'Authentication failed',
          message: 'The API token is invalid or expired. Please check your Melhor Envio token.',
          details: data,
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (response.status === 422) {
        return new Response(JSON.stringify({
          error: 'Validation error',
          message: 'Invalid data sent to API',
          details: data,
          payload: payload
        }), {
          status: 422,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        error: 'API error',
        status: response.status,
        statusText: response.statusText,
        details: data,
        payload: payload
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    console.error('Internal error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Internal error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
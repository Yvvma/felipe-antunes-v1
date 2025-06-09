const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN;
const MELHOR_ENVIO_EMAIL = process.env.MELHOR_ENVIO_EMAIL;
const NODE_ENV = process.env.NODE_ENV || 'development';

export const melhorEnvioConfig = {
  token: MELHOR_ENVIO_TOKEN,
  email: MELHOR_ENVIO_EMAIL,
  sandbox: NODE_ENV !== 'production',
  apiUrl: NODE_ENV === 'production' 
    ? 'https://www.melhorenvio.com.br/api/v2' 
    : 'https://sandbox.melhorenvio.com.br/api/v2'
};
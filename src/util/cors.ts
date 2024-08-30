import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Middleware para añadir encabezados CORS a la respuesta según el stage (DEV, QA, PROD).
 * @param result - La respuesta de la Lambda.
 * @returns La respuesta con encabezados CORS añadidos.
 */
export const addCorsHeaders = (result: APIGatewayProxyResult): APIGatewayProxyResult => {
    const stage = process.env.stage ?? 'DEV'; // Por defecto, se considera 'DEV' si no está definido
    console.log(`Stage: ${stage}`);

    // Mapeo de los valores de CORS según el stage
    const corsConfig: Record<string, string> = {
        DEV: '*',
        QA: 'https://myfrontend.com, https://myfrontend2.com',
        PROD: 'https://myfrontendProd1.com, https://myfrontendProd2.com',
    };

    // Asignar el valor de 'Access-Control-Allow-Origin' en base al stage
    const allowOrigin = corsConfig[stage] || corsConfig.DEV; // Si el stage no existe, usa el de DEV por defecto

    return {
        ...result,
        headers: {
            ...result.headers,
            'Access-Control-Allow-Origin': allowOrigin,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key',
        },
    };
};

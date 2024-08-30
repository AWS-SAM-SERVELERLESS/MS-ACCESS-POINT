import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { addCorsHeaders } from '../util/cors';

const eventBridgeClient = new EventBridgeClient();

/**
 * Lambda handler para procesar eventos de API Gateway y publicarlos en un bus de eventos de EventBridge.
 * 
 * @param event - El evento de API Gateway que contiene los detalles de la solicitud.
 * @returns Una promesa que se resuelve con un resultado que incluye un mensaje de éxito o error.
 * 
 * @remarks
 * Este handler realiza las siguientes acciones:
 * - Parsea el cuerpo del evento recibido de API Gateway.
 * - Filtra ciertos parámetros conocidos del cuerpo (por ejemplo, 'name' y 'married').
 * - Envía los detalles como un evento a EventBridge.
 * - Devuelve una respuesta HTTP con los encabezados CORS aplicados según el stage.
 * 
 * @example
 * ```typescript
 * const response = await lambdaHandler(apiGatewayEvent);
 * console.log(response.statusCode); // 200 o 500
 * ```
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const stage = process.env.stage;
  const idAcconut = process.env.idAcconut;

  try {
    // Parsear el cuerpo del evento recibido de API Gateway
    const requestBody = event.body ? JSON.parse(event.body) : null;

    /**
     * Lista de parámetros conocidos que serán extraídos del cuerpo del evento.
     * Solo los parámetros incluidos en este array serán procesados.
     */
    const knownParams = ['name', 'married'];

    /**
     * Filtrar los parámetros conocidos del cuerpo del evento.
     * 
     * @remarks
     * Solo se extraen los valores asociados a las claves especificadas en `knownParams`.
     */
    const eventDetails = Object.fromEntries(
      Object.entries(requestBody).filter(([key]) => knownParams.includes(key))
    );

    /**
     * Detalles completos del evento, incluyendo los parámetros conocidos y no conocidos.
     */
    const allDetails = { ...requestBody, ...eventDetails };

    /**
     * Parámetros del evento que se enviarán a EventBridge.
     * 
     * @remarks
     * Se envía el detalle del evento como un JSON en el campo `Detail`. 
     * El nombre del bus de eventos está basado en el `stage` y `idAccount` obtenidos de las variables de entorno.
     */
    const eventParams = {
      Entries: [
        {
          Source: 'Lambda publish', // Origen del evento
          DetailType: 'ejecuta lambda', // Tipo de detalle del evento
          Detail: JSON.stringify(allDetails), // Detalle del evento
          EventBusName: `arn:aws:events:us-east-1:${idAcconut}:event-bus/access-point-bus-${stage}`,  
          Time: new Date('TIMESTAMP'), // Hora del evento
        },
      ],
    };

    // Enviar el evento a EventBridge utilizando el cliente de AWS SDK
    const putEventsCommand = new PutEventsCommand(eventParams);
    eventBridgeClient.send(putEventsCommand);

    // Devolver respuesta HTTP con encabezados CORS
    return addCorsHeaders({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Evento enviado',
      }),
    });
  } catch (error) {
    console.error('Error al enviar el evento a EventBridge:', error);

    // Manejar error y devolver respuesta HTTP con encabezados CORS
    return addCorsHeaders({
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    });
  }
};

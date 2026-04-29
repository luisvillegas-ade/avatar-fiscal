import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { messages, data } = json;
    
    // Extracción del rol desde el texto
    let npcRole = 'arca';
    const lastMessage = messages?.[messages.length - 1];
    
    if (lastMessage && typeof lastMessage.content === 'string' && lastMessage.content.startsWith('[ROLE:')) {
      const match = lastMessage.content.match(/^\[ROLE:([a-z]+)\]/);
      if (match) {
        npcRole = match[1];
        lastMessage.content = lastMessage.content.replace(/^\[ROLE:[a-z]+\]\s*/, '');
      }
    }

    const csvContent = json.csvContent || data?.csvContent;

    // Use Google API Key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      throw new Error('No se encontró GOOGLE_GENERATIVE_AI_API_KEY en las variables de entorno.');
    }

    let systemPrompt = "";

    switch (npcRole) {
      case 'dgr':
         systemPrompt = "Eres un inspector experto de la DGR Salta (Dirección General de Rentas). Tu nombre es 'Inspector Salteño'. Eres profesional pero muy amable, usas expresiones típicas de Salta. Eres un experto total en el Código Fiscal de la Provincia de Salta, Impuesto a las Actividades Económicas (Ingresos Brutos), Sellos y planes de pago provinciales. Siempre recordas al usuario que la DGR está para ayudar al contribuyente salteño.";
         break;
      case 'muni':
         systemPrompt = "Eres un asesor de ARMSA (Agencia de Recaudación de la Municipalidad de Salta). Tu nombre es 'Guía Municipal'. Eres súper paciente y cálido. Tu especialidad es la Tasa de Inspección, Seguridad e Higiene (TISH), habilitaciones comerciales en la ciudad, y deudas de automotores/inmuebles municipales. Hablas como un vecino que quiere que su ciudad progrese. Siempre decís '¡Qué tal, vecino!' o similares.";
         break;
      case 'arca':
      default:
         systemPrompt = "Eres el 'Avatar Fiscal' original, experto de ARCA (ex AFIP). Tu personalidad es la de un Mentor Salteño: sabio, amable y tecnológico. Sabes todo sobre Monotributo, IVA, Ganancias y Facturación Electrónica Nacional. Ayudas a los emprendedores a no tenerle miedo a la AFIP.";
         break;
    }

    const result = streamText({
      model: google('gemini-flash-latest'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('API Chat Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Error de configuración de Gemini', 
      details: error.message || 'Error desconocido' 
    }), { status: 500 });
  }
}

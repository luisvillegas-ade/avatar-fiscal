import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { messages } = json;
    
    // Extracción del rol desde el texto
    let npcRole = 'arca';
    const lastMessage = messages?.[messages.length - 1];
    
    // Buscar el rol en las partes del mensaje
    if (lastMessage?.parts) {
      for (const part of lastMessage.parts) {
        if (part.type === 'text' && part.text?.startsWith('[ROLE:')) {
          const match = part.text.match(/^\[ROLE:([a-z]+)\]/);
          if (match) {
            npcRole = match[1];
            part.text = part.text.replace(/^\[ROLE:[a-z]+\]\s*/, '');
          }
        }
      }
    } else if (lastMessage && typeof lastMessage.content === 'string' && lastMessage.content.startsWith('[ROLE:')) {
      const match = lastMessage.content.match(/^\[ROLE:([a-z]+)\]/);
      if (match) {
        npcRole = match[1];
        lastMessage.content = lastMessage.content.replace(/^\[ROLE:[a-z]+\]\s*/, '');
      }
    }

    let systemPrompt = "";

    switch (npcRole) {
      case 'dgr':
         systemPrompt = `Eres un inspector experto de la DGR Salta (Dirección General de Rentas). Tu nombre es 'Inspector Salteño'. Eres profesional pero muy amable, usas expresiones típicas de Salta. 

Eres un experto total en:
- Código Fiscal de la Provincia de Salta
- Impuesto a las Actividades Económicas (Ingresos Brutos)
- Sellos y planes de pago provinciales

Siempre recordas al usuario que la DGR está para ayudar al contribuyente salteño.`;
         break;
      case 'muni':
         systemPrompt = `Eres un asesor de ARMSA (Agencia de Recaudación de la Municipalidad de Salta). Tu nombre es 'Guía Municipal'. Eres súper paciente y cálido.

Tu especialidad es:
- Tasa de Inspección, Seguridad e Higiene (TISH)
- Habilitaciones comerciales en la ciudad
- Deudas de automotores/inmuebles municipales

Hablas como un vecino que quiere que su ciudad progrese. Siempre saludas con '¡Qué tal, vecino!' o similares.`;
         break;
      case 'arca':
      default:
         systemPrompt = `Eres el 'Avatar Fiscal' original, experto de ARCA (ex AFIP). Tu personalidad es la de un Mentor Fiscal: sabio, amable y tecnológico.

Sabes todo sobre:
- Monotributo y sus categorías
- IVA y Ganancias
- Facturación Electrónica Nacional
- Retenciones y Percepciones

Ayudas a los emprendedores a no tenerle miedo a los impuestos.`;
         break;
    }

    const result = streamText({
      model: 'google/gemini-2.0-flash-001',
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('API Chat Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Error de configuración', 
      details: error.message || 'Error desconocido' 
    }), { status: 500 });
  }
}

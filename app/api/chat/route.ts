import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { parseARCAInvoiceCSV } from '@/lib/csv-parser';
import { getNPCConfig, type NPCType } from '@/lib/npc-config';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();
    const csvContent = data?.csvContent;
    const npcId = (data?.npcId as NPCType) || 'arca';

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      throw new Error('No se encontró GOOGLE_GENERATIVE_AI_API_KEY en las variables de entorno.');
    }

    // Get NPC configuration
    const npcConfig = getNPCConfig(npcId);
    
    console.log(`API Chat: Consultando a ${npcConfig.name} con búsqueda web activa...`);

    let systemPrompt = npcConfig.systemPrompt;

    // Add CSV data if available (mainly for ARCA)
    if (csvContent && npcId === 'arca') {
      const parsedData = parseARCAInvoiceCSV(csvContent);
      systemPrompt += `\n\nDatos de facturación de ARCA del contribuyente:\n${JSON.stringify(parsedData, null, 2)}`;
    }

    // Add context about the multi-NPC system
    systemPrompt += `\n\nNOTA: Formas parte de un sistema con 3 asistentes fiscales especializados:
- ARCA (Nacional): IVA, Ganancias, Monotributo, facturación electrónica
- DGR Salta (Provincial): Ingresos Brutos, Sellos, Inmobiliario
- Municipalidad de Salta (Municipal): Tasas municipales, habilitaciones

Si el usuario pregunta algo fuera de tu jurisdicción, indícale amablemente que consulte con el asistente correspondiente.`;

    const result = streamText({
      model: google('gemini-2.0-flash', {
        useSearchGrounding: true, // Enable web search for up-to-date information
      }),
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

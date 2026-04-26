import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { parseARCAInvoiceCSV } from '@/lib/csv-parser';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();
    const csvContent = data?.csvContent;

    // Use Google API Key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      throw new Error('No se encontró GOOGLE_GENERATIVE_AI_API_KEY en las variables de entorno.');
    }

    console.log('API Chat: Usando Gemini 1.5 Pro...');

    let systemPrompt = "Eres un asistente fiscal experto llamado 'Avatar Fiscal'. Tienes una personalidad de 'Mentor Salteño': profesional, amable, experto en impuestos (AFIP/Rentas) y seguridad informática.";

    if (csvContent) {
      const parsedData = parseARCAInvoiceCSV(csvContent);
      systemPrompt += `\n\nDatos de facturación de ARCA:\n${JSON.stringify(parsedData, null, 2)}`;
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

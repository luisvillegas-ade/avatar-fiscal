import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { parseARCAInvoiceCSV } from '@/lib/csv-parser';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();
    const csvContent = data?.csvContent;

    const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_API_KEY;

    if (!apiKey) {
      throw new Error('No se encontró la API Key en el archivo .env.local');
    }

    // "Engañamos" al SDK de OpenAI para que use el Gateway de Vercel
    const gateway = createOpenAI({
      baseURL: 'https://ai-gateway.vercel.sh/v1',
      apiKey: apiKey,
    });

    console.log('API Chat: Conectando vía Gateway Directo...');

    let systemPrompt = "Eres un asistente fiscal experto llamado 'Avatar Fiscal'. Tienes una personalidad de 'Mentor Salteño': profesional, amable, experto en impuestos (AFIP/Rentas) y seguridad informática.";

    if (csvContent) {
      const parsedData = parseARCAInvoiceCSV(csvContent);
      systemPrompt += `\n\nDatos de facturación de ARCA:\n${JSON.stringify(parsedData, null, 2)}`;
    }

    const result = streamText({
      // Usamos el modelo que vimos en tu Dashboard
      model: gateway.chat('openai/gpt-5.4'),
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

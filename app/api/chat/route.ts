import { streamText, convertToModelMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { parseARCAInvoiceCSV } from '@/lib/csv-parser';

export const maxDuration = 30;

// Usar Google Gemini directamente con tu API key gratuita
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();
    const csvContent = data?.csvContent;

    let systemPrompt = "Eres un asistente fiscal experto llamado 'Avatar Fiscal'. Tienes una personalidad de 'Mentor Salteño': profesional, amable, experto en impuestos (AFIP/Rentas) y seguridad informática.";

    if (csvContent) {
      const parsedData = parseARCAInvoiceCSV(csvContent);
      systemPrompt += `\n\nDatos de facturación de ARCA:\n${JSON.stringify(parsedData, null, 2)}`;
    }

    // Google Gemini 2.0 Flash - rápido y gratuito
    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error('API Chat Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ 
      error: 'Error de configuración', 
      details: errorMessage
    }), { status: 500 });
  }
}

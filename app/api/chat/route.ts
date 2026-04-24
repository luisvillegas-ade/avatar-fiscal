import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { parseARCAInvoiceCSV } from '@/lib/csv-parser';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, csvContent } = await req.json();

  let systemPrompt = "Eres un asistente fiscal experto llamado 'Avatar Fiscal'.";

  if (csvContent) {
    const parsedData = parseARCAInvoiceCSV(csvContent);
    systemPrompt += `\n\nHas recibido datos de facturación de ARCA:\n${JSON.stringify(parsedData, null, 2)}\n\nUsa estos datos para responder preguntas del usuario sobre sus finanzas, impuestos y facturación.`;
  }

  const result = await streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}

import { start } from 'workflow/api';
import { analizarSituacionFiscal } from '@/app/workflows/analisis-fiscal';

export async function POST(req: Request) {
  try {
    const datos = await req.json();
    
    // Iniciar el workflow de análisis fiscal
    const run = await start(analizarSituacionFiscal, [datos]);
    
    // Esperar el resultado del workflow
    const resultado = await run.returnValue;
    
    return Response.json({
      success: true,
      runId: run.runId,
      resultado,
    });
  } catch (error) {
    console.error('Error en workflow de análisis fiscal:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const runId = searchParams.get('runId');
  
  if (!runId) {
    return Response.json(
      { error: 'Se requiere runId' },
      { status: 400 }
    );
  }
  
  try {
    const { getRun } = await import('workflow/api');
    const run = getRun(runId);
    const resultado = await run.returnValue;
    
    return Response.json({
      success: true,
      runId,
      resultado,
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}

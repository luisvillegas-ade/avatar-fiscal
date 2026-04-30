'use server';

import { generateText } from 'ai';

// Tipos de datos fiscales
interface DatosFiscales {
  ventasNetas: string;
  comprasNetas: string;
  actividad: string;
  condicionIVA: string;
  ubicacion: string;
  medioCobro: string;
  comentariosAdicionales?: string;
}

interface AnalisisResult {
  organismo: string;
  obligaciones: string[];
  recomendaciones: string[];
  alertas: string[];
}

interface ReporteCompleto {
  resumen: string;
  analisisArca: AnalisisResult;
  analisisDgr: AnalisisResult;
  analisisMuni: AnalisisResult;
  proximosPasos: string[];
  fechaAnalisis: string;
}

// Step: Analizar obligaciones ARCA (Impuestos Nacionales)
async function analizarObligacionesArca(datos: DatosFiscales): Promise<AnalisisResult> {
  'use step';
  
  const prompt = `Sos un experto en impuestos nacionales argentinos (ARCA/AFIP).
Analizá la siguiente situación fiscal y devolvé un JSON con este formato exacto:
{
  "organismo": "ARCA",
  "obligaciones": ["obligación 1", "obligación 2"],
  "recomendaciones": ["recomendación 1", "recomendación 2"],
  "alertas": ["alerta importante si hay"]
}

Datos del contribuyente:
- Ventas Netas Mensuales: ${datos.ventasNetas || 'No especificado'}
- Compras Netas Mensuales: ${datos.comprasNetas || 'No especificado'}
- Actividad: ${datos.actividad || 'No especificado'}
- Condición IVA: ${datos.condicionIVA || 'No especificado'}
- Ubicación: ${datos.ubicacion || 'No especificado'}
- Medio de Cobro: ${datos.medioCobro || 'No especificado'}
${datos.comentariosAdicionales ? `- Comentarios: ${datos.comentariosAdicionales}` : ''}

Respondé SOLO con el JSON, sin texto adicional.`;

  const result = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    prompt,
  });

  try {
    return JSON.parse(result.text);
  } catch {
    return {
      organismo: 'ARCA',
      obligaciones: ['Error al procesar análisis'],
      recomendaciones: ['Consultar con un contador'],
      alertas: [],
    };
  }
}

// Step: Analizar obligaciones DGR Salta (Impuestos Provinciales)
async function analizarObligacionesDgr(datos: DatosFiscales): Promise<AnalisisResult> {
  'use step';
  
  const prompt = `Sos un experto en impuestos provinciales de Salta, Argentina (DGR - Dirección General de Rentas).
Analizá la siguiente situación fiscal y devolvé un JSON con este formato exacto:
{
  "organismo": "DGR Salta",
  "obligaciones": ["obligación 1", "obligación 2"],
  "recomendaciones": ["recomendación 1", "recomendación 2"],
  "alertas": ["alerta importante si hay"]
}

Datos del contribuyente:
- Ventas Netas Mensuales: ${datos.ventasNetas || 'No especificado'}
- Compras Netas Mensuales: ${datos.comprasNetas || 'No especificado'}
- Actividad: ${datos.actividad || 'No especificado'}
- Condición IVA: ${datos.condicionIVA || 'No especificado'}
- Ubicación: ${datos.ubicacion || 'No especificado'}
- Medio de Cobro: ${datos.medioCobro || 'No especificado'}
${datos.comentariosAdicionales ? `- Comentarios: ${datos.comentariosAdicionales}` : ''}

Enfocate en Ingresos Brutos, Sellos, y otros impuestos provinciales de Salta.
Respondé SOLO con el JSON, sin texto adicional.`;

  const result = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    prompt,
  });

  try {
    return JSON.parse(result.text);
  } catch {
    return {
      organismo: 'DGR Salta',
      obligaciones: ['Error al procesar análisis'],
      recomendaciones: ['Consultar con un contador'],
      alertas: [],
    };
  }
}

// Step: Analizar obligaciones Municipalidad de Salta (Tasas Municipales)
async function analizarObligacionesMuni(datos: DatosFiscales): Promise<AnalisisResult> {
  'use step';
  
  const prompt = `Sos un experto en tasas municipales de la Ciudad de Salta, Argentina.
Analizá la siguiente situación fiscal y devolvé un JSON con este formato exacto:
{
  "organismo": "Municipalidad de Salta",
  "obligaciones": ["obligación 1", "obligación 2"],
  "recomendaciones": ["recomendación 1", "recomendación 2"],
  "alertas": ["alerta importante si hay"]
}

Datos del contribuyente:
- Ventas Netas Mensuales: ${datos.ventasNetas || 'No especificado'}
- Compras Netas Mensuales: ${datos.comprasNetas || 'No especificado'}
- Actividad: ${datos.actividad || 'No especificado'}
- Condición IVA: ${datos.condicionIVA || 'No especificado'}
- Ubicación: ${datos.ubicacion || 'No especificado'}
- Medio de Cobro: ${datos.medioCobro || 'No especificado'}
${datos.comentariosAdicionales ? `- Comentarios: ${datos.comentariosAdicionales}` : ''}

Enfocate en DREI (Derecho de Registro e Inspección), habilitaciones comerciales, y otras tasas municipales.
Respondé SOLO con el JSON, sin texto adicional.`;

  const result = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    prompt,
  });

  try {
    return JSON.parse(result.text);
  } catch {
    return {
      organismo: 'Municipalidad de Salta',
      obligaciones: ['Error al procesar análisis'],
      recomendaciones: ['Consultar con un contador'],
      alertas: [],
    };
  }
}

// Step: Generar resumen ejecutivo
async function generarResumenEjecutivo(
  datos: DatosFiscales,
  analisisArca: AnalisisResult,
  analisisDgr: AnalisisResult,
  analisisMuni: AnalisisResult
): Promise<{ resumen: string; proximosPasos: string[] }> {
  'use step';
  
  const prompt = `Sos un contador público argentino generando un resumen ejecutivo para un cliente.

Datos del contribuyente:
- Ventas: ${datos.ventasNetas || 'No especificado'}
- Actividad: ${datos.actividad || 'No especificado'}
- Condición: ${datos.condicionIVA || 'No especificado'}

Análisis ARCA: ${JSON.stringify(analisisArca)}
Análisis DGR: ${JSON.stringify(analisisDgr)}
Análisis Muni: ${JSON.stringify(analisisMuni)}

Generá un JSON con este formato:
{
  "resumen": "Un párrafo de 2-3 oraciones resumiendo la situación fiscal general",
  "proximosPasos": ["paso 1", "paso 2", "paso 3"]
}

Los próximos pasos deben ser acciones concretas y ordenadas por prioridad.
Respondé SOLO con el JSON.`;

  const result = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    prompt,
  });

  try {
    return JSON.parse(result.text);
  } catch {
    return {
      resumen: 'Se completó el análisis fiscal. Consulte los detalles por organismo.',
      proximosPasos: ['Revisar obligaciones detectadas', 'Consultar con contador matriculado'],
    };
  }
}

// Workflow Principal: Análisis Fiscal Completo
export async function analizarSituacionFiscal(datos: DatosFiscales): Promise<ReporteCompleto> {
  'use workflow';
  
  // Ejecutar análisis en paralelo para los 3 organismos
  const [analisisArca, analisisDgr, analisisMuni] = await Promise.all([
    analizarObligacionesArca(datos),
    analizarObligacionesDgr(datos),
    analizarObligacionesMuni(datos),
  ]);
  
  // Generar resumen ejecutivo con todos los análisis
  const { resumen, proximosPasos } = await generarResumenEjecutivo(
    datos,
    analisisArca,
    analisisDgr,
    analisisMuni
  );
  
  return {
    resumen,
    analisisArca,
    analisisDgr,
    analisisMuni,
    proximosPasos,
    fechaAnalisis: new Date().toISOString(),
  };
}

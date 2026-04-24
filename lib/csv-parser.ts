export interface InvoiceData {
  fecha: string;
  tipo: string;
  cuitEmisor: string;
  denominacion: string;
  impNetoGravado: number;
  impTotal: number;
}

/**
 * Parses a CSV string from ARCA (ex-AFIP) and returns an array of invoice data.
 * Expected fields: Fecha, Tipo, CUIT Emisor, Denominación, Imp. Neto Gravado, Imp. Total.
 */
export function parseARCAInvoiceCSV(csvContent: string): InvoiceData[] {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  // Assuming the first line is the header, but ARCA CSVs often have complex headers.
  // We'll search for the line that contains our keywords.
  const headerIndex = lines.findIndex(line => 
    line.toLowerCase().includes('fecha') && 
    line.toLowerCase().includes('cuit')
  );

  if (headerIndex === -1) {
    console.error('Header not found in CSV');
    return [];
  }

  const header = lines[headerIndex].split(',').map(h => h.trim().replace(/"/g, ''));
  const dataLines = lines.slice(headerIndex + 1);

  const getFieldIndex = (names: string[]) => {
    return header.findIndex(h => names.some(name => h.toLowerCase().includes(name.toLowerCase())));
  };

  const indices = {
    fecha: getFieldIndex(['fecha']),
    tipo: getFieldIndex(['tipo']),
    cuit: getFieldIndex(['cuit']),
    denominacion: getFieldIndex(['denominación', 'razón social', 'nombre']),
    neto: getFieldIndex(['neto gravado']),
    total: getFieldIndex(['total']),
  };

  return dataLines.map(line => {
    // Simple CSV split, handling quoted strings if necessary
    // This is a naive split, but often sufficient for ARCA CSVs if they are simple
    const parts = line.split(',').map(p => p.trim().replace(/"/g, ''));
    
    return {
      fecha: parts[indices.fecha] || '',
      tipo: parts[indices.tipo] || '',
      cuitEmisor: parts[indices.cuit] || '',
      denominacion: parts[indices.denominacion] || '',
      impNetoGravado: parseFloat(parts[indices.neto]) || 0,
      impTotal: parseFloat(parts[indices.total]) || 0,
    };
  });
}

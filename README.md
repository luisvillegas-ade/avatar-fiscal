# Avatar Fiscal - Next.js 14 Structure

Estructura base para el proyecto "Avatar Fiscal" con integración de simulador y asistente AI.

## Requisitos
- Node.js 18+
- Un archivo `.env.local` con tu `OPENAI_API_KEY`

## Cómo empezar
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Características
- **Layout Split Screen**: 70% Simulador (iframe) / 30% Panel de Control (AvatarPanel).
- **Comunicación Iframe**: Listener configurado para recibir mensajes del simulador.
- **Asistente AI**: Implementado con Vercel AI SDK y GPT-4o.
- **Parsing de CSV**: Lógica específica para extraer datos de facturación de ARCA (Fecha, Tipo, CUIT, Denominación, Neto, Total).
- **Estilo Salta**: Color personalizado `salta-bordo` (#800020) y diseño Premium Dark Mode.

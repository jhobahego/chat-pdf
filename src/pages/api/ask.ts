import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const responseSSE = (
  { request }: { request: Request },
  callback: (sendEvent: (data: any) => void) => Promise<void>
) => {
  const body = new ReadableStream({
    async start(controller) {
      // Text encoder for converting strings to Uint8Array
      const encoder = new TextEncoder();
  
      // Send event to client
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      await callback(sendEvent);
  
      // Handle the connection closing
      request.signal.addEventListener('abort', () => {
        controller.close();
      });
    }
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}

export const GET: APIRoute = async ({ request }) => {
  if (!GEMINI_API_KEY) {
    return new Response('Gemini API key not found', { status: 500 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const question = url.searchParams.get('question');

  if (!id || !question) {
    return new Response('Missing required parameters', { status: 400 });
  }

  try {
    const txt = await readFile(`public/text/${id}.txt`, 'utf-8');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on this document content: "${txt}", please answer the following question: ${question}. Keep the answer concise and relevant to the document content. **Responde siempre en español.**`;

    return responseSSE({ request }, async (sendEvent) => {
      const result = await model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        sendEvent(chunkText);
      }
      
      sendEvent('__END__');
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500 }
    );
  }
}
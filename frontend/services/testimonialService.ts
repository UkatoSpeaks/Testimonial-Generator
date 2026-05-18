import { API_BASE_URL } from '@/lib/api';
import { GenerationRequest, StreamEvent } from '@/types/testimonial';

export class TestimonialService {
  /**
   * Streams testimonial generation progress and final results from the backend.
   * Delimited by newlines (\n) where each line is a JSON string.
   */
  static async streamGeneration(
    params: GenerationRequest,
    onEvent: (event: StreamEvent) => void,
    onError: (error: any) => void
  ): Promise<ReadableStreamReader<Uint8Array> | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/stream-testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate testimonials: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      // Set up a loop to read the stream chunks
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');

            // Save the last partial line (if any) back to the buffer
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;

              try {
                const data = JSON.parse(trimmed) as StreamEvent;
                onEvent(data);
              } catch (parseError) {
                console.error('Failed to parse stream line:', trimmed, parseError);
              }
            }
          }

          // If there is any remaining data in the buffer
          if (buffer.trim()) {
            try {
              const data = JSON.parse(buffer.trim()) as StreamEvent;
              onEvent(data);
            } catch (parseError) {
              console.error('Failed to parse final stream line:', buffer, parseError);
            }
          }
        } catch (streamError) {
          onError(streamError);
        }
      })();

      return reader;
    } catch (error) {
      onError(error);
      return undefined;
    }
  }
}

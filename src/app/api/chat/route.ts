import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { db } from '@/db/drizzle';
import { chatHistory } from '@/db/schema';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
import { Ollama } from 'ollama'

export async function POST(req: NextRequest) {
  const { message, userId } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  let fullResponse = ""; // This will accumulate the concatenated text

  const readableStream = new ReadableStream({
    async start(controller) {
      const AI_SERVICE = process.env.AI_SERVICE as string
      const MODEL = process.env.MODEL as string
      if (AI_SERVICE == "OPENAI") {
        try {
          const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const response = await client.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: MODEL,
            stream: true,
          });
          for await (const chunk of response) {
            try {
              const content = chunk.choices[0]?.delta?.content || "";
              fullResponse += content; // Accumulate the full response

              // Construct the JSON data with the concatenated response
              const sseData = JSON.stringify({
                message: {
                  content: { parts: [fullResponse] },
                },
              });

              // Send the data back in SSE format
              controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
              // Close the stream if the response is fully complete
              if (chunk.choices[0].finish_reason === "stop") {
                controller.close();
                break;
              }
            } catch (err) {
              console.error("Error processing chunk", err);
              controller.error(err);
              controller.close();
              break;
            }
          }
          await db.insert(chatHistory).values({
            userId: Number(userId),
            query: message,
            response: fullResponse || '',
          });
          return NextResponse.json({
            status: 200,
            data: message,
          });
          controller.close();

        } catch (err) {
          console.error("Error in OpenAI stream", err);
          controller.error(err);
          controller.close();
        }
      } else {
        try {
          const ollama = new Ollama({ host: 'http://localhost:11434' })
          const response = await ollama.chat({
            model: MODEL,
            messages: [{ role: 'user', content: message }],
            stream: true
          })

          for await (const chunk of response) {
            try {
              const content = chunk.message.content || "";
              fullResponse += content; // Accumulate the full response

              // Construct the JSON data with the concatenated response
              const sseData = JSON.stringify({
                message: {
                  content: { parts: [fullResponse] },
                },
              });

              // Send the data back in SSE format
              controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
            } catch (err) {
              console.error("Error processing chunk", err);
              controller.error(err);
              controller.close();
              break;
            }
          }
          controller.close();
          await db.insert(chatHistory).values({
            userId: Number(userId),
            query: message,
            response: fullResponse || '',
          });
          return NextResponse.json({
            status: 200,
            data: message,
          });
          controller.close();
        } catch (err) {
          console.error("Error in OpenAI stream", err);
          controller.error(err);
          controller.close();
        }

      }

    },

  });


  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
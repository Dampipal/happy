import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req) {
  try {
    const { base64Data, mediaType } = await req.json();

    if (!base64Data) {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Detect any number visible in this image. Return only the number(s).",
            },
            {
              type: "file",
              data: base64Data,
              mediaType,
            },
          ],
        },
      ],
    });

    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

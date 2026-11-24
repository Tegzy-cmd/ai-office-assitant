import {ollama} from "../providers/ollama.provider";

export async function* summarizeReviews(reviews: string[]) {
    const stream = await ollama.chat({
        model: "gemma3:4b",
        messages: [
      {
        role: "user",
        content: `Summarize these customer reviews. Identify recurring positive themes, recurring concerns, and practical follow-ups. Base the summary only on the reviews provided.\n\n${reviews
          .map((review, index) => `${index + 1}. ${review}`)
          .join("\n")}`,
      },
    ],
    stream: true,
  });

  for await (const part of stream) {
    const text = part.message.content;
    if (text) yield text;
  }
}
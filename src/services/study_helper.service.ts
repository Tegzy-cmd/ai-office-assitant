import {ollama  } from "../providers/ollama.provider";

export async function* helpwithStudyMaterial(material: string) {
    try {
        const stream = await ollama.chat({
            model: "gemma3:4b",
            messages: [
                {
                    role: "user",
                    content: `Help me study this material. Explain the key ideas in clear, simple language, then create 5 recall questions with answers. Use only information supported by the material.\n\n${material}`,
                },
            ],
            stream: true,
        });

        for await (const part of stream) {
            const text = part.message?.content;
            if (text) {
                yield text;
            }
        }
    } catch (error) {
        console.error("Error in helpwithStudyMaterial service:", error);
        throw error;
    }
}
import {ollama} from "../providers/ollama.provider";

export async function* cleanMeetingNotes(notes: string){
    try{
        const stream = await ollama.chat({
        model: "gemma3:4b",
        messages: [
            {
                role: "user",
                content: `Clean up these meeting notes. Return a concise summary, decisions, and action items. Don’t invent details.\n\n${notes}`,},], stream: true,});

    for await (const part of stream) {
        const text = part.message?.content;
        if (text) {
            yield text;
        }
    }
} catch (error) {
    console.error("Error in cleanMeetingNotes service:", error);
    throw error;
}
}
import type { Request, Response } from "express";
import type { MeetingNotesRequestDto } from "../dtos/meeting_notes.dto";
import { cleanMeetingNotes } from "../services/meeting-notes.service";

export async function cleanMeetingNotesController(req: Request, res: Response): Promise<any> {
    const { notes } = req.body;

    const stingNotes = JSON.stringify(notes);

  if (!notes || typeof notes !== "string") {
    return res.status(400).json({ error: "notes must be a non-empty string" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
res.on("close", () => {
  if (!res.writableEnded) {
    console.log("Client disconnected before the stream finished");
  }
});
  try {
    for await (const text of cleanMeetingNotes(notes)) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
      res.write(`event: chunk\ndata: ${JSON.stringify({ text })}\n\n`);
    }

    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error cleaning meeting notes:", error);
    res.write(`event: error\ndata: ${JSON.stringify({ error: "Could not process meeting notes" })}\n\n`);
    res.end();
  }
}
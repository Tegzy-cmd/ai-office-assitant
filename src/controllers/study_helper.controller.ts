import type { Request, Response } from 'express';
import type { StudyHelperRequestDto } from '../dtos/study_helper.dto';
import { helpwithStudyMaterial } from '../services/study_helper.service';

export async function studyHelperController(
  req: Request<{}, {}, StudyHelperRequestDto>,
  res: Response
) {
  const { material } = req.body;

  if (!material || typeof material !== "string") {
    return res.status(400).json({ error: "material must be a non-empty string" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    for await (const text of helpwithStudyMaterial(material)) {
      res.write(`event: chunk\ndata: ${JSON.stringify({ text })}\n\n`);
    }

    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error in studyHelperController:", error);
    res.write(
      `event: error\ndata: ${JSON.stringify({
        error: "Could not process study material",
      })}\n\n`
    );
    res.end();
  }
}
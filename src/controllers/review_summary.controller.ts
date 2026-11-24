import type { Request, Response} from 'express';
import type { ReviewSummaryRequestDto } from '../dtos/review_summary.dto';
import { summarizeReviews } from '../services/review_summary.service';

export async function reviewSummaryController(
  req: Request<{}, {}, ReviewSummaryRequestDto>,
  res: Response
) {
  const { reviews } = req.body;

  if (
    !Array.isArray(reviews) ||
    reviews.length === 0 ||
    !reviews.every((review) => typeof review === "string" && review.trim())
  ) {
    return res.status(400).json({
      error: "reviews must be a non-empty array of non-empty strings",
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    for await (const text of summarizeReviews(reviews)) {
      res.write(`event: chunk\ndata: ${JSON.stringify({ text })}\n\n`);
    }

    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error summarizing reviews:", error);

    res.write(
      `event: error\ndata: ${JSON.stringify({
        error: "Could not summarize reviews",
      })}\n\n`
    );
    res.end();
  }
}
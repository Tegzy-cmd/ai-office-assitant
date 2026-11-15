import express from "express";
import assitantRouter from "./routes/assistant.routes";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import assistantRouter from "./routes/assistant.routes";
import reviewRouter from "./routes/review-summary.routes";
// import connectDB from "./config/db";

// connectDB().then(() => {
//   migrateExistingImagesToFiles();
// });

const app = express();

// Middleware
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5500"
    ],
    credentials: true,
  }),
);
app.use(helmet());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// app.use(morgan("dev"));



// Routes
app.use("/api/assist/meeting-notes", assistantRouter);
app.use("/api/assist/review-summary", reviewRouter)


// Start Job

//API HEALTH CHECK

app.use("/api/", (_req, res) => {
  res.status(200).json({
    message: "API working fine! (this is a test response)",
  });
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

export default app;

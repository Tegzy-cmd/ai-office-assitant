# AI Office Assistant API

A TypeScript and Express backend for office productivity tasks. It uses a locally running Ollama model and streams generated text to clients with Server-Sent Events (SSE).

> **Project stage:** Meeting-notes cleaning, review summarization, and study-helper routes are mounted. Image triage and the frontend are planned, not implemented yet.

## Features

### Meeting notes cleaner
Accepts meeting notes and streams a cleaned response from the local model. The prompt asks for a concise summary, decisions, and action items without inventing details.

### Review summarizer
Accepts a list of customer reviews. The prompt asks for recurring positive themes, concerns, and practical follow-ups.

### Study helper
Accepts study material. The prompt asks for a plain-language explanation and five recall questions with answers, grounded in the supplied material.

### Planned: image triage
Image triage has not been implemented yet. The intended feature is to inspect an uploaded image and report what is visible, including legible text and items that may need attention.

## Technology

- Node.js
- TypeScript
- Express 5
- Ollama JavaScript client
- `gemma3:4b` local model
- Server-Sent Events for streamed responses
- `pnpm` for package management

## Project structure

```text
src/
├── config/       # Environment configuration
├── controllers/  # HTTP request handling and SSE responses
├── dtos/         # Request and response data types
├── providers/    # Ollama client setup
├── routes/       # Feature route modules
├── services/     # Prompt construction and model streaming
├── utils/        # Logging helpers
├── app.ts        # Express middleware and route mounting
└── index.ts      # Environment loading and server startup
```

## Prerequisites

- Node.js compatible with the installed project dependencies
- pnpm
- [Ollama](https://ollama.com/download) installed and running
- The `gemma3:4b` model downloaded locally

Pull the model if needed:

```bash
ollama pull gemma3:4b
```

The model runs on your computer. Response speed depends on available memory and hardware.

## Configuration

The Ollama provider reads `OLLAMA_HOST` from the environment. Set it in the environment file used by the app, for example `.env.staging`:

```env
PORT=5000
OLLAMA_HOST=http://127.0.0.1:11434
```

The app loads `.env.<NODE_ENV>` first and then falls back to `.env`. The development script sets `NODE_ENV=staging`, so it loads `.env.staging` by default. Do not commit environment files containing secrets or machine-specific settings.

## Install and run

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The configured development command runs `src/index.ts` with automatic restarts. By default, the server listens on port `5000`.

Build and run the compiled server:

```bash
pnpm build
pnpm start
```

## API

All implemented assistant endpoints accept JSON and stream responses as SSE. A successful stream contains `chunk` events with JSON data shaped like `{ "text": "..." }`, followed by a `done` event. A processing failure is sent as an `error` event. Request validation errors are returned as HTTP 400 JSON responses before streaming begins.

### Health check

```http
GET /health
```

### Meeting notes cleaner

Mounted at:

```http
POST /api/assist/meeting-notes
Content-Type: application/json
```

Request:

```json
{
  "notes": "Discussed the launch timeline. Ada will share revised dates on Friday."
}
```

The router is mounted at `/api/assist/meeting-notes` and handles `POST /`.

### Review summarizer

Mounted at `POST /api/assist/review-summary`. Its router handles `POST /`.

Request body:

```json
{
  "reviews": [
    "Delivery was fast and support was helpful.",
    "The product is good, but the packaging was damaged."
  ]
}
```

### Study helper

Mounted at `POST /api/assist/study-helper`. Its router handles `POST /`.

Request body:

```json
{
  "material": "Photosynthesis converts light energy into chemical energy. Plants use carbon dioxide and water to produce glucose and oxygen."
}
```

### Image triage

Not available yet. The image-triage DTO, service, controller, and route still need to be implemented and mounted.

## SSE client notes

SSE uses `Content-Type: text/event-stream`. Each event is separated by a blank line. Clients should append the `text` values from successive `chunk` events, stop on `done`, and display the message from `error` if an error event arrives.

For a browser frontend, use `fetch()` with a streaming response reader when sending a JSON POST body. The browser's native `EventSource` API is designed for GET requests and does not directly send a JSON POST body.

## Current limitations and next steps

- The meeting-notes controller currently writes both an unnamed `data` event and a named `chunk` event for each model chunk. Standardize on the named event to avoid duplicate client output.
- Add robust request validation and input size limits to the feature controllers.
- Improve SSE error handling and client-disconnect handling.
- Implement image triage using a vision-capable local model and image input validation.
- Add automated checks and request examples for each endpoint.
- Build the Next.js frontend after the backend routes are complete.

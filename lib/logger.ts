const INTAKE = "https://http-intake.logs.datadoghq.com/api/v2/logs";

type Level = "info" | "warn" | "error" | "debug";

async function send(status: Level, message: string, meta?: Record<string, unknown>) {
  const apiKey = process.env.DD_API_KEY;
  if (!apiKey) return;
  try {
    await fetch(INTAKE, {
      method: "POST",
      headers: { "Content-Type": "application/json", "DD-API-KEY": apiKey },
      body: JSON.stringify([{
        ddsource: "nodejs",
        service: "tende",
        ddtags: `env:${process.env.NODE_ENV ?? "production"}`,
        status,
        message,
        ...meta,
      }]),
    });
  } catch {
    // log failures must never surface to users
  }
}

export const logger = {
  info:  (msg: string, meta?: Record<string, unknown>) => send("info",  msg, meta),
  warn:  (msg: string, meta?: Record<string, unknown>) => send("warn",  msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => send("error", msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => send("debug", msg, meta),
};

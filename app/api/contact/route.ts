import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // TODO: wire up an email service (e.g. Resend) to forward messages to Sage.
  // For now, log to server console so submissions aren't silently dropped.
  console.log("Contact form submission:", { name, email, message, at: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}

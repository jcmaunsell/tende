import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";

const { GET: enableDraftMode } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_TOKEN }),
});

export async function GET(request: Request) {
  try {
    return await enableDraftMode(request);
  } catch (err) {
    console.error("[draft-mode/enable]", err);
    return new Response(String(err), { status: 500 });
  }
}

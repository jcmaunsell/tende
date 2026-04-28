import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const { GET: enableDraftMode } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_TOKEN }),
});

export async function GET(request: Request) {
  try {
    return await enableDraftMode(request);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[draft-mode/enable]", err);
    return new Response(String(err), { status: 500 });
  }
}

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const dm = await draftMode();
  dm.disable();
  const { searchParams } = new URL(request.url);
  redirect(searchParams.get("redirect") ?? "/");
}

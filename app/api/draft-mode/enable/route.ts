import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";

export const { GET } = defineEnableDraftMode({ client });

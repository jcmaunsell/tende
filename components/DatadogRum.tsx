"use client";

import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";

export default function DatadogRum() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_DD_APPLICATION_ID || !process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN) return;
    datadogRum.init({
      applicationId: process.env.NEXT_PUBLIC_DD_APPLICATION_ID,
      clientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN,
      site: "datadoghq.com",
      service: "tende",
      env: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
      sessionSampleRate: 100,
      sessionReplaySampleRate: 0,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
    });
  }, []);
  return null;
}

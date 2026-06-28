import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
  GITHUB_ACTIVITY_HTTP_CACHE,
  type ActivityKVNamespace,
  resolveGitHubActivity,
} from "@/lib/githubActivity";

export const prerender = false;

interface GitHubActivityEnv {
  GITHUB_ACTIVITY?: ActivityKVNamespace;
  GITHUB_TOKEN?: string;
}

export const GET: APIRoute = async ({ locals }) => {
  const workerEnv = env as unknown as GitHubActivityEnv;

  try {
    const activity = await resolveGitHubActivity({
      githubToken: workerEnv.GITHUB_TOKEN,
      kv: workerEnv.GITHUB_ACTIVITY,
      waitUntil: locals.cfContext?.waitUntil.bind(locals.cfContext),
    });

    return json(activity);
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "GitHub activity is unavailable.",
      },
      503,
      "no-store",
    );
  }
};

function json(data: unknown, status = 200, cacheControl = GITHUB_ACTIVITY_HTTP_CACHE) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
    },
  });
}

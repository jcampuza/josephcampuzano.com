import { GITHUB_TOKEN } from "astro:env/server";
import type { APIRoute } from "astro";
import { GITHUB_ACTIVITY_HTTP_CACHE, resolveGitHubActivity } from "@/lib/githubActivity";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const activity = await resolveGitHubActivity({
      githubToken: GITHUB_TOKEN,
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

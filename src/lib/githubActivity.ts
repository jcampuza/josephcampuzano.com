import { Octokit } from "octokit";

const GITHUB_API_VERSION = "2022-11-28";

export const GITHUB_ACTIVITY_USERNAME = "jcampuza";
export const GITHUB_ACTIVITY_HTTP_CACHE =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

export type GitHubActivitySource = "github";

export interface GitHubActivityTotals {
  contributions: number;
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
  repositories: number;
}

export interface GitHubActivityCalendarDay {
  date: string;
  count: number;
  level: string;
  color: string;
  weekday: number;
}

export interface GitHubActivityCalendarWeek {
  days: GitHubActivityCalendarDay[];
}

export interface GitHubActivityRepository {
  name: string;
  url: string;
  description: string | null;
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
  updatedAt: string | null;
  contributionCount: number | null;
}

export interface GitHubActivityEvent {
  id: string;
  type: string;
  title: string;
  repo: string;
  url: string;
  occurredAt: string;
}

export interface GitHubActivityRateLimit {
  remaining: number | null;
  resetAt: string | null;
}

export interface GitHubActivitySnapshot {
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  profileUrl: string;
  generatedAt: string;
  stale: boolean;
  source: GitHubActivitySource;
  totals: GitHubActivityTotals;
  calendar: GitHubActivityCalendarWeek[];
  topRepositories: GitHubActivityRepository[];
  recentActivity: GitHubActivityEvent[];
  rateLimit: GitHubActivityRateLimit;
  error?: string;
}

interface GitHubActivityCacheRecord {
  data: Omit<GitHubActivitySnapshot, "stale" | "source" | "error">;
}

export interface ResolveGitHubActivityOptions {
  githubToken?: string;
  now?: Date;
}

interface GitHubGraphQLResponse {
  rateLimit?: {
    remaining: number;
    resetAt: string;
  };
  user?: {
    login: string;
    name: string | null;
    avatarUrl: string | null;
    bio: string | null;
    url: string;
    repositories: {
      totalCount: number;
      nodes: Array<GraphQLRepository | null>;
    };
    contributionsCollection: {
      totalCommitContributions: number;
      totalIssueContributions: number;
      totalPullRequestContributions: number;
      totalPullRequestReviewContributions: number;
      totalRepositoryContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            date: string;
            contributionCount: number;
            contributionLevel: string;
            color: string;
            weekday: number;
          }>;
        }>;
      };
      commitContributionsByRepository: Array<{
        contributions: {
          totalCount: number;
        };
        repository: GraphQLRepository;
      }>;
    };
  };
}

interface GraphQLRepository {
  name: string;
  url: string;
  description: string | null;
  updatedAt?: string;
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
}

const ACTIVITY_QUERY = `
  query GitHubActivity($login: String!, $from: DateTime!, $to: DateTime!) {
    rateLimit {
      remaining
      resetAt
    }
    user(login: $login) {
      login
      name
      avatarUrl
      bio
      url
      repositories(
        first: 8
        ownerAffiliations: OWNER
        privacy: PUBLIC
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          url
          description
          updatedAt
          primaryLanguage {
            name
            color
          }
        }
      }
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalRepositoryContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
              color
              weekday
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 8) {
          contributions {
            totalCount
          }
          repository {
            name
            url
            description
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
`;

export async function resolveGitHubActivity({
  githubToken,
  now = new Date(),
}: ResolveGitHubActivityOptions): Promise<GitHubActivitySnapshot> {
  if (!githubToken) {
    throw new Error("GITHUB_TOKEN is not configured.");
  }

  const data = await fetchGitHubActivity(githubToken, now);

  return withCacheState(data, {
    stale: false,
    source: "github",
  });
}

export async function fetchGitHubActivity(
  githubToken: string,
  now = new Date(),
): Promise<GitHubActivityCacheRecord["data"]> {
  const octokit = createGitHubClient(githubToken);
  const from = new Date(now);
  from.setUTCFullYear(from.getUTCFullYear() - 1);

  const graphqlPayload = await octokit.graphql<GitHubGraphQLResponse>(ACTIVITY_QUERY, {
    login: GITHUB_ACTIVITY_USERNAME,
    from: from.toISOString(),
    to: now.toISOString(),
  });

  const user = graphqlPayload.user;

  if (!user) {
    throw new Error(`GitHub user "${GITHUB_ACTIVITY_USERNAME}" was not found.`);
  }

  const contributions = user.contributionsCollection;
  const contributionCounts = new Map(
    contributions.commitContributionsByRepository.map((item) => [
      item.repository.url,
      item.contributions.totalCount,
    ]),
  );
  const recentRepositories = user.repositories.nodes
    .filter((repository): repository is GraphQLRepository => Boolean(repository))
    .map((repository) =>
      normalizeRepository(repository, contributionCounts.get(repository.url) ?? null),
    );

  return {
    username: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    profileUrl: user.url,
    generatedAt: now.toISOString(),
    totals: {
      contributions: contributions.contributionCalendar.totalContributions,
      commits: contributions.totalCommitContributions,
      pullRequests: contributions.totalPullRequestContributions,
      issues: contributions.totalIssueContributions,
      reviews: contributions.totalPullRequestReviewContributions,
      repositories: user.repositories.totalCount,
    },
    calendar: contributions.contributionCalendar.weeks.map((week) => ({
      days: week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: day.contributionLevel,
        color: day.color,
        weekday: day.weekday,
      })),
    })),
    topRepositories: recentRepositories.slice(0, 8),
    recentActivity: [],
    rateLimit: {
      remaining: graphqlPayload.rateLimit?.remaining ?? null,
      resetAt: graphqlPayload.rateLimit?.resetAt ?? null,
    },
  };
}

function withCacheState(
  data: GitHubActivityCacheRecord["data"],
  state: Pick<GitHubActivitySnapshot, "stale" | "source"> & { error?: string },
): GitHubActivitySnapshot {
  return {
    ...data,
    stale: state.stale,
    source: state.source,
    error: state.error,
  };
}

function createGitHubClient(githubToken: string) {
  return new Octokit({
    auth: githubToken,
    userAgent: "josephcampuzano.com",
    request: {
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
    },
  });
}

function normalizeRepository(
  repository: GraphQLRepository,
  contributionCount: number | null,
): GitHubActivityRepository {
  return {
    name: repository.name,
    url: repository.url,
    description: repository.description,
    primaryLanguage: repository.primaryLanguage,
    updatedAt: repository.updatedAt ?? null,
    contributionCount,
  };
}

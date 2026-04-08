import { NextResponse } from "next/server";
import { google } from "googleapis";

type AnalyticsPoint = {
  date: string;
  sessions: number;
  users: number;
  articleViews: number;
};

type TopPage = {
  page: string;
  views: number;
};

type AnalyticsPayload = {
  ok: boolean;
  rangeDays: number;
  measurementId: string | null;
  propertyId: string;
  points: AnalyticsPoint[];
  topPages: TopPage[];
  summary: {
    totalSessions: number;
    totalArticleViews: number;
    totalUsers: number;
  };
  source: "ga-data-api";
  message?: string;
  generatedAt: string;
};

function parseRangeDays(rawRange: string | null): 7 | 14 | 30 {
  if (rawRange === "14") {
    return 14;
  }
  if (rawRange === "30") {
    return 30;
  }
  return 7;
}

function readEnv(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function gaDateToIso(value: string): string {
  if (value.length !== 8) {
    return value;
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function toMetricNumber(value: string | null | undefined): number {
  const parsed = Number(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

function asErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Khong the tai du lieu Google Analytics";
}

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rangeDays = parseRangeDays(searchParams.get("range"));

  const propertyId = readEnv([
    "GA4_PROPERTY_ID",
    "GOOGLE_ANALYTICS_PROPERTY_ID",
  ]);
  const clientEmail = readEnv([
    "GA_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  ]);
  const privateKey = readEnv([
    "GA_SERVICE_ACCOUNT_PRIVATE_KEY",
    "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  ]);
  const measurementId =
    readEnv(["NEXT_PUBLIC_GA_ID", "GA_MEASUREMENT_ID"]) ?? null;

  if (!propertyId || !clientEmail || !privateKey) {
    return NextResponse.json(
      {
        ok: false,
        rangeDays,
        measurementId,
        propertyId: propertyId ?? null,
        points: [],
        topPages: [],
        summary: {
          totalSessions: 0,
          totalArticleViews: 0,
          totalUsers: 0,
        },
        source: "ga-data-api",
        message:
          "Thieu cau hinh GA Data API. Can GA4_PROPERTY_ID, GA_SERVICE_ACCOUNT_EMAIL, GA_SERVICE_ACCOUNT_PRIVATE_KEY.",
        generatedAt: new Date().toISOString(),
      },
      { status: 500 },
    );
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsData = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    const [timelineResponse, topPagesResponse] = await Promise.all([
      analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate: `${rangeDays}daysAgo`,
              endDate: "today",
            },
          ],
          dimensions: [{ name: "date" }],
          metrics: [
            { name: "sessions" },
            { name: "activeUsers" },
            { name: "screenPageViews" },
          ],
          orderBys: [
            {
              dimension: {
                dimensionName: "date",
              },
            },
          ],
          keepEmptyRows: true,
        },
      }),
      analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate: `${rangeDays}daysAgo`,
              endDate: "today",
            },
          ],
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          orderBys: [
            {
              metric: {
                metricName: "screenPageViews",
              },
              desc: true,
            },
          ],
          limit: "8",
        },
      }),
    ]);

    const points: AnalyticsPoint[] = (timelineResponse.data.rows ?? []).map(
      (row) => {
        const dateRaw = row.dimensionValues?.[0]?.value ?? "";
        return {
          date: gaDateToIso(dateRaw),
          sessions: toMetricNumber(row.metricValues?.[0]?.value),
          users: toMetricNumber(row.metricValues?.[1]?.value),
          articleViews: toMetricNumber(row.metricValues?.[2]?.value),
        };
      },
    );

    const topPages: TopPage[] = (topPagesResponse.data.rows ?? [])
      .map((row) => {
        const page = row.dimensionValues?.[0]?.value ?? "(khong ro)";
        const views = toMetricNumber(row.metricValues?.[0]?.value);
        return { page, views };
      })
      .filter((item) => item.views > 0);

    const payload: AnalyticsPayload = {
      ok: true,
      rangeDays,
      measurementId,
      propertyId,
      points,
      topPages,
      summary: {
        totalSessions: points.reduce((sum, item) => sum + item.sessions, 0),
        totalArticleViews: points.reduce(
          (sum, item) => sum + item.articleViews,
          0,
        ),
        totalUsers: points.reduce((sum, item) => sum + item.users, 0),
      },
      source: "ga-data-api",
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        rangeDays,
        measurementId,
        propertyId,
        points: [],
        topPages: [],
        summary: {
          totalSessions: 0,
          totalArticleViews: 0,
          totalUsers: 0,
        },
        source: "ga-data-api",
        message: asErrorMessage(error),
        generatedAt: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

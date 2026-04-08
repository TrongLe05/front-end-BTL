"use client";

// FIND_TAG: DASHBOARD_ANALYTICS_UI

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Clock3, Eye, FileText, Users } from "lucide-react";
import Link from "next/link";

import { TrafficOverviewChart } from "./traffic-overview-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DateRange = 7 | 14 | 30;

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

type AnalyticsResponse = {
  ok: boolean;
  rangeDays: number;
  measurementId: string | null;
  propertyId: string | null;
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

const RANGE_OPTIONS: DateRange[] = [7, 14, 30];

const quickAdminLinks = [
  {
    name: "Quản lý tài khoản",
    href: "/admin/quan-ly-tai-khoan",
    note: "Phân quyền, khóa/mở tài khoản",
    keyMetric: "1,245 tài khoản",
  },
  {
    name: "Quản lý bài viết",
    href: "/admin/quan-ly-bai-viet",
    note: "Duyệt và cập nhật nội dung",
    keyMetric: "324 bài viết",
  },
  {
    name: "Quản lý danh mục",
    href: "/admin/quan-ly-danh-muc",
    note: "Sắp xếp taxonomy nội dung",
    keyMetric: "28 danh mục",
  },
];

function toDisplayDateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
}

export function AdminAnalyticsDashboard() {
  const [rangeDays, setRangeDays] = useState<DateRange>(7);
  const [payload, setPayload] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isDisposed = false;

    async function loadAnalyticsData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(
          `/api/admin/analytics?range=${rangeDays}`,
          {
            cache: "no-store",
          },
        );

        const data = (await response.json()) as AnalyticsResponse;

        if (!response.ok || !data.ok) {
          throw new Error("Không thể tải dữ liệu analytics.");
        }

        if (!isDisposed) {
          setPayload(data);
        }
      } catch (error) {
        if (!isDisposed) {
          setErrorMessage(
            error instanceof Error ? error.message : "Không thể tải dữ liệu.",
          );
          setPayload(null);
        }
      } finally {
        if (!isDisposed) {
          setIsLoading(false);
        }
      }
    }

    void loadAnalyticsData();

    return () => {
      isDisposed = true;
    };
  }, [rangeDays]);

  const points = payload?.points ?? [];
  const chartLabels = useMemo(
    () => points.map((item) => toDisplayDateLabel(item.date)),
    [points],
  );
  const sessionSeries = useMemo(
    () => points.map((item) => item.sessions),
    [points],
  );
  const articleViewSeries = useMemo(
    () => points.map((item) => item.articleViews),
    [points],
  );

  const totalSessions = payload?.summary.totalSessions ?? 0;
  const totalArticleViews = payload?.summary.totalArticleViews ?? 0;
  const totalUsers = payload?.summary.totalUsers ?? 0;
  const averageArticleViews = points.length
    ? Math.round(totalArticleViews / points.length)
    : 0;
  const latest = points[points.length - 1];
  const previous = points[points.length - 2];
  const sessionGrowth =
    latest && previous ? latest.sessions - previous.sessions : 0;
  const dateRange = points.length
    ? `${toDisplayDateLabel(points[0].date)} - ${toDisplayDateLabel(points[points.length - 1].date)}`
    : "-";
  const topPages = payload?.topPages ?? [];

  const kpis = [
    {
      title: `Phiên truy cập ${rangeDays} ngày`,
      value: totalSessions.toLocaleString("vi-VN"),
      change: `${sessionGrowth >= 0 ? "+" : ""}${sessionGrowth.toLocaleString("vi-VN")} so với ngày trước`,
      icon: Eye,
    },
    {
      title: "Người dùng 7 ngày",
      value: totalUsers.toLocaleString("vi-VN"),
      change: latest ? `${latest.users.toLocaleString("vi-VN")} hôm nay` : "-",
      icon: Users,
    },
    {
      title: "Lượt xem bài viết",
      value: totalArticleViews.toLocaleString("vi-VN"),
      change: `${averageArticleViews.toLocaleString("vi-VN")}/ngày`,
      icon: FileText,
    },
  ];

  const trafficSummary = [
    {
      label: "Tổng phiên 7 ngày",
      value: totalSessions.toLocaleString("vi-VN"),
      icon: Clock3,
    },
    {
      label: "Thời gian truy cập TB",
      value: "01:18",
      icon: Clock3,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-2xl font-bold">Tổng quan Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Biểu đồ dùng Chart.js, dữ liệu lấy trực tiếp từ Google Analytics Data
          API.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Nguồn: {payload?.source ?? "dang tai"} | Khoảng ngày: {dateRange}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {RANGE_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={rangeDays === option ? "default" : "outline"}
            size="sm"
            disabled={isLoading}
            onClick={() => setRangeDays(option)}
          >
            {option} ngày
          </Button>
        ))}
      </div>

      {errorMessage ? (
        <Card>
          <CardHeader>
            <CardTitle>Không thể tải dữ liệu analytics</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardHeader className="pb-2">
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-2xl">{item.value}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="flex items-center gap-1 text-xs font-medium text-blue-700">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {item.change}
                </p>
                <span className="rounded-md bg-muted p-1.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ lượt truy cập từ Google Analytics</CardTitle>
          <CardDescription>
            Dữ liệu theo ngày từ GA Data API, hiển thị bằng Chart.js.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrafficOverviewChart
            labels={chartLabels}
            sessions={sessionSeries}
            articleViews={articleViewSeries}
          />
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {trafficSummary.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-md border px-3 py-2 text-xs"
                >
                  <p className="text-muted-foreground">{item.label}</p>
                  <p className="mt-1 flex items-center gap-1.5 font-medium">
                    <Icon className="h-3.5 w-3.5" />
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top trang bài viết theo lượt xem</CardTitle>
            <CardDescription>
              Dữ liệu từ Google Analytics Data API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trang</TableHead>
                  <TableHead className="text-right">Lượt xem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.length ? (
                  topPages.map((item) => (
                    <TableRow key={item.page}>
                      <TableCell className="font-medium">{item.page}</TableCell>
                      <TableCell className="text-right">
                        {item.views.toLocaleString("vi-VN")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-muted-foreground" colSpan={2}>
                      {isLoading
                        ? "Đang tải dữ liệu..."
                        : "Không có dữ liệu trong khoảng ngày đã chọn."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Truy cập nhanh quản lý</CardTitle>
            <CardDescription>
              Điểm vào nhanh đến các phân hệ quản trị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mục quản lý</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead>Chỉ số</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quickAdminLinks.map((item) => (
                  <TableRow key={item.href}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.note}</TableCell>
                    <TableCell>{item.keyMetric}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>Mở mục</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  trackPublicApplication,
  type TrackedApplication,
} from "@/lib/api/procedure";

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusStyle(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "approved") {
    return {
      icon: CheckCircle2,
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (normalizedStatus === "rejected") {
    return {
      icon: XCircle,
      className: "border-rose-200 bg-rose-50 text-rose-700",
    };
  }

  if (normalizedStatus === "processing") {
    return {
      icon: Clock3,
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    icon: Clock3,
    className: "border-slate-200 bg-slate-100 text-slate-700",
  };
}

export function PublicApplicationTrackPage() {
  const [applicationCode, setApplicationCode] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<TrackedApplication | null>(null);
  const [isNotFound, setIsNotFound] = React.useState(false);

  const handleSearch = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const normalizedCode = applicationCode.trim();
      if (!normalizedCode) {
        setErrorMessage("Vui lòng nhập mã hồ sơ để tra cứu.");
        setResult(null);
        setIsNotFound(false);
        return;
      }

      setIsSearching(true);
      setErrorMessage(null);
      setResult(null);
      setIsNotFound(false);

      try {
        const trackedApplication = await trackPublicApplication(normalizedCode);

        if (!trackedApplication) {
          setIsNotFound(true);
          return;
        }

        setResult(trackedApplication);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tra cứu hồ sơ. Vui lòng thử lại.",
        );
      } finally {
        setIsSearching(false);
      }
    },
    [applicationCode],
  );

  const statusStyle = result ? getStatusStyle(result.status) : null;

  return (
    <main className="container mx-auto space-y-6 px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="w-fit px-0">
        <Link href="/dich-vu">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang Dịch vụ
        </Link>
      </Button>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Badge
          variant="secondary"
          className="mb-3 rounded-full border border-blue-200 bg-blue-50 text-blue-700"
        >
          PublicApplications API
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Tra cứu hồ sơ
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
          Nhập mã hồ sơ được cấp khi nộp online để xem tình trạng xử lý hồ sơ.
        </p>
      </section>

      <Card className="overflow-hidden border-slate-200 py-0">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Tìm kiếm hồ sơ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="applicationCode"
                className="font-medium text-slate-700"
              >
                Mã hồ sơ
              </Label>
              <Input
                id="applicationCode"
                value={applicationCode}
                onChange={(event) => setApplicationCode(event.target.value)}
                placeholder="VD: HS-2026-0001"
                autoComplete="off"
              />
            </div>

            <Button
              type="submit"
              disabled={isSearching}
              className="w-full bg-[#0f5fc6] text-white hover:bg-[#0c4ea2] md:w-auto"
            >
              {isSearching ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Search className="mr-2 size-4" />
              )}
              Tra cứu
            </Button>
          </form>

          {errorMessage ? (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          ) : null}

          {isNotFound ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Không tìm thấy hồ sơ theo mã bạn vừa nhập. Vui lòng kiểm tra lại.
            </div>
          ) : null}
        </CardContent>
      </Card>

      {result && statusStyle ? (
        <Card className="overflow-hidden border-slate-200 py-0">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Kết quả tra cứu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Badge className={statusStyle.className}>
                <statusStyle.icon className="mr-1 size-4" />
                {result.statusText || "Chưa xác định"}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Mã hồ sơ
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-slate-900">
                  {result.applicationCode}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Ngày nộp
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {formatDate(result.createdAt)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Người nộp
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {result.applicantName || "-"}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  CCCD/CMND
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {result.identityNumber || "-"}
                </p>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Thông tin thủ tục
              </p>
              <p className="text-sm text-slate-700">
                Lĩnh vực: <strong>{result.categoryName || "-"}</strong>
              </p>
              <p className="text-sm text-slate-700">
                Thủ tục: <strong>{result.serviceName || "-"}</strong>
              </p>
              <p className="text-sm text-slate-700">
                Địa chỉ: <strong>{result.address || "-"}</strong>
              </p>
            </div>

            {result.attachedFileUrl ? (
              <Button
                asChild
                variant="outline"
                className="border-slate-300 bg-white hover:bg-slate-100"
              >
                <Link href={result.attachedFileUrl} target="_blank">
                  Xem tệp hồ sơ đã nộp
                </Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}

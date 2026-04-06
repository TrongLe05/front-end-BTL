import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getProcedureFields, type ProcedureField } from "@/lib/api/procedure";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  let fields: ProcedureField[] = [];

  try {
    fields = await getProcedureFields();
  } catch {
    return (
      <main className="container mx-auto px-4 py-10">
        <p className="text-sm text-red-600">
          Không thể tải danh sách lĩnh vực thủ tục hành chính. Vui lòng thử lại
          sau.
        </p>
        <Button asChild variant="outline" className="mt-4" size="sm">
          <Link href="/dich-vu">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang Dịch vụ
          </Link>
        </Button>
      </main>
    );
  }

  if (fields.length === 0) {
    return (
      <main className="container mx-auto px-4 py-10">
        <p className="text-sm text-muted-foreground">
          Hiện chưa có lĩnh vực thủ tục hành chính khả dụng.
        </p>
        <Button asChild variant="outline" className="mt-4" size="sm">
          <Link href="/dich-vu">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang Dịch vụ
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4 px-0">
        <Link href="/dich-vu">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang Dịch vụ
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-900 ">
          Thủ tục hành chính
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Tra cứu thủ tục hành chính theo từng lĩnh vực cụ thể
        </p>
      </div>

      <section className="grid gap-5 grid-cols-4">
        {fields.map((field) => (
          <Card
            key={field.serviceCategoryId}
            className="overflow-hidden border border-slate-200 py-0"
          >
            <CardHeader className="items-center pt-10 text-center ">
              <p className="text-2xl font-bold uppercase tracking-tight text-[#1f3c88]">
                Lĩnh vực
              </p>
              <h2 className="mt-2 text-3xl font-extrabold uppercase leading-tight text-[#cc2955] ">
                {field.fieldName}
              </h2>
            </CardHeader>

            <CardContent className="sr-only">
              {field.description ?? ""}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t-0 bg-[#0f5fc6] px-4 py-4 ">
              <Button
                asChild
                size="default"
                variant="secondary"
                className="rounded-full bg-pink-600 px-3 font-bold uppercase tracking-wide text-white hover:bg-pink-700"
              >
                <Link
                  href={`/dich-vu/thu-tuc-hanh-chinh/${field.serviceCategoryId}?fieldName=${encodeURIComponent(field.fieldName)}`}
                >
                  Xem nội dung
                </Link>
              </Button>
              <p className="text-base font-semibold text-white">
                {field.procedureCount} thủ tục
              </p>
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  );
}

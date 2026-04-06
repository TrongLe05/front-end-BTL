"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
const services = [
  {
    id: 1,
    href: "/dich-vu/thu-tuc-hanh-chinh",
    title: "Thủ tục hành chính",
    description:
      "Cung cấp thông tin và hướng dẫn về các thủ tục hành chính tại Phường Cao Lãnh.",
  },
  {
    id: 2,
    href: "/dich-vu/nop-ho-so",
    title: "Nộp hồ sơ",
    description:
      "Hỗ trợ nộp hồ sơ trực tuyến cho các dịch vụ công tại Phường Cao Lãnh.",
  },
  {
    id: 3,
    href: "/dich-vu/tai-bieu-mau",
    title: "Tải biểu mẫu",
    description:
      "Cung cấp các biểu mẫu cần thiết cho các thủ tục hành chính và dịch vụ công.",
  },
];

export default function DichVu() {
  const router = useRouter();
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="rounded-2xl border bg-linear-to-r from-sky-50 via-white to-cyan-50 p-6 md:p-8 mb-10">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Dịch vụ
        </h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <h2 className="text-xl inline-flex font-semibold leading-snug line-clamp-2">
                  {service.title}
                </h2>
                <CardTitle className="text-base text-muted-foreground leading-snug line-clamp-2">
                  {service.description}
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full hover:bg-pink-600 hover:text-white transition-colors duration-400"
                  onClick={() => {
                    router.push(service.href);
                  }}
                >
                  Tìm hiểu thêm
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

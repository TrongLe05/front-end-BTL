"use client";

import NewPasswordForm from "@/components/auth/new-password-form";
import { useSearchParams } from "next/navigation";

export default function TaoMatKhauPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? undefined;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[url('/cau-cao-lanh.jpg')] bg-cover bg-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <NewPasswordForm email={email} />
      </div>
    </div>
  );
}

"use client";

import { RefreshCwIcon } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Link from "next/link";
import { useRouter } from "next/navigation";

type OTPFormProps = {
  email?: string;
};

export function OTPForm({ email = "m@example.com" }: OTPFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerifyOTP = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP.");
      return;
    }

    setError(null);
    router.push(`/tao-mat-khau?email=${encodeURIComponent(email)}`);
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Khôi phục mật khẩu</CardTitle>
        <CardAction>
          <Link href="/dang-nhap">
            <Button variant="link">Trở về đăng nhập</Button>
          </Link>
        </CardAction>
        <CardDescription>
          Nhập vào mã OTP mà chúng tôi đã gửi đến email của bạn:{" "}
          <span className="font-medium text-blue-500">{email}</span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleVerifyOTP}>
        <CardContent>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="otp-verification">Mã xác minh</FieldLabel>
              <Button variant="outline" size="xs" type="button">
                <RefreshCwIcon />
                Gửi lại mã
              </Button>
            </div>

            <InputOTP
              maxLength={6}
              id="otp-verification"
              required
              containerClassName="justify-center"
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (error) setError(null);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="h-12 w-11 text-xl" />
                <InputOTPSlot index={1} className="h-12 w-11 text-xl" />
                <InputOTPSlot index={2} className="h-12 w-11 text-xl" />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup>
                <InputOTPSlot index={3} className="h-12 w-11 text-xl" />
                <InputOTPSlot index={4} className="h-12 w-11 text-xl" />
                <InputOTPSlot index={5} className="h-12 w-11 text-xl" />
              </InputOTPGroup>
            </InputOTP>

            <FieldError>{error}</FieldError>

            <FieldDescription>
              <a href="#">
                Tôi không còn truy cập được vào địa chỉ email này nữa.
              </a>
            </FieldDescription>
          </Field>
        </CardContent>
        <CardFooter>
          <Field>
            <Button
              type="submit"
              className="w-full"
              disabled={otp.length !== 6}
            >
              Xác minh
            </Button>
            <div className="text-sm text-muted-foreground">
              Bạn gặp sự cố khi đăng nhập?{" "}
              <a
                href="#"
                className="underline underline-offset-4 transition-colors hover:text-primary"
              >
                Liên hệ bộ phận hỗ trợ
              </a>
            </div>
          </Field>
        </CardFooter>
      </form>
    </Card>
  );
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type NewPasswordFormProps = {
  email?: string;
};

export default function NewPasswordForm({
  email = "m@example.com",
}: NewPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setError(null);

    // TODO: Call API cập nhật mật khẩu tại đây.
    router.push("/dang-nhap");
  };

  return (
    <Card className="mx-auto w-full max-w-sm hover:shadow-2xl/50 transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Tạo mật khẩu mới</CardTitle>
        <CardDescription>
          Thiết lập mật khẩu mới cho tài khoản:{" "}
          <span className="font-medium text-blue-500">{email}</span>
        </CardDescription>
        <CardAction>
          <Link href="/dang-nhap">
            <Button variant="link">Trở về đăng nhập</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="new-password">Mật khẩu mới</FieldLabel>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-new-password">
                Nhập lại mật khẩu mới
              </FieldLabel>
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <FieldError>{error}</FieldError>
              <FieldDescription>
                Mật khẩu nên có chữ hoa, chữ thường, số và ký tự đặc biệt.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter>
          <Field>
            <Button type="submit" className="w-full">
              Cập nhật mật khẩu
            </Button>
          </Field>
        </CardFooter>
      </form>
    </Card>
  );
}

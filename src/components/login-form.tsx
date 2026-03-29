"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-sm hover:shadow-2xl/50 transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email của bạn bên dưới để đăng nhập vào tài khoản
          </CardDescription>
          <CardAction>
            <Link href="/">
              <Button variant="link">Trở về trang chủ</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Tài khoản</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tài khoản hoặc email"
                  autoComplete="username"
                />
                <FieldError />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    <Button variant="link" className="ml-auto p-0">
                      Quên mật khẩu?{" "}
                    </Button>
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                />
                <FieldError />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Đăng nhập
                </Button>
                <Button variant="outline" type="button">
                  Đăng nhập với Google
                </Button>

                <FieldDescription className="text-center">
                  Chưa có tài khoản?
                  <Link href="#">
                    <Button variant="link" className="ml-auto p-1">
                      Đăng ký
                    </Button>
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

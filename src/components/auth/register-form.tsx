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

function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-sm hover:shadow-2xl/50 transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Đăng ký</CardTitle>
          <CardDescription>
            Nhập tên tài khoản hoặc email của bạn bên dưới để tạo tài khoản
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
                <FieldLabel htmlFor="username">Tên tài khoản</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên tài khoản hoặc email"
                  autoComplete="username"
                />
                <FieldError />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                />
                <FieldError />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="rePassword">
                    Nhập lại mật khẩu
                  </FieldLabel>
                </div>
                <Input
                  id="rePassword"
                  type="password"
                  autoComplete="new-password"
                />
                <FieldError />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Đăng ký
                </Button>
                <Button variant="outline" type="button">
                  Đăng ký với Google
                </Button>
                <FieldDescription className="text-center">
                  Bạn đã có tài khoản?
                  <Link href="/dang-nhap">
                    <Button variant="link" className="ml-auto p-1">
                      Đăng nhập
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

export default RegisterForm;

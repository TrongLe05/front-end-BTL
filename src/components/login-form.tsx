"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
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
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl font-bold">
            Đăng nhập
          </CardTitle>
          <CardDescription className="flex justify-center">
            Nhập Email và mật khẩu của bạn để đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  autoComplete="email"
                />
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

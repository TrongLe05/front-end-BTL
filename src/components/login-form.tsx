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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { error } from "console";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
    // Xử lý đăng nhập ở đây, ví dụ: gọi API để xác thực người dùng
    if (data) {
      console.log("Dữ liệu đăng nhập:", data);
    } else {
      console.error("Dữ liệu không hợp lệ");
    }
  };

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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  {...form.register("email")}
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
                  {...form.register("password")}
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

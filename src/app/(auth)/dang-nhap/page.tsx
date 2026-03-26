// app/(auth)/dang-nhap/page.tsx

// import CardLogin from "@/components/ui/Card/CardLogin/CardLogin";
import { LoginForm } from "@/components/login-form";
export default function DangNhap() {
  return (
    // <div className="relative left-1/2 right-1/2 -mx-[50vw] min-h-screen w-screen bg-[url('/cau-cao-lanh.jpg')] bg-cover bg-center">
    //   {/* <CardLogin /> */}
    //   <LoginForm></LoginForm>
    // </div>

    <div className="flex min-h-svh flex-col items-center justify-center bg-[url('/cau-cao-lanh.jpg')] bg-cover bg-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

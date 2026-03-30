import NewPasswordForm from "@/components/auth/new-password-form";

type TaoMatKhauPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function TaoMatKhauPage({
  searchParams,
}: TaoMatKhauPageProps) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[url('/cau-cao-lanh.jpg')] bg-cover bg-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <NewPasswordForm email={email} />
      </div>
    </div>
  );
}

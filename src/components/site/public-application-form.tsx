"use client";

import * as React from "react";
import {
  Loader2,
  Send,
  Copy,
  CheckCircle2,
  ChevronDownIcon,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { submitPublicApplication } from "@/lib/api/procedure";
import Link from "next/link";

type PublicApplicationFormProps = {
  selectedProcedureId?: number;
};

export function PublicApplicationForm({
  selectedProcedureId,
}: PublicApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedCode, setSubmittedCode] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);
  const successPanelRef = React.useRef<HTMLDivElement>(null);
  const [date, setDate] = React.useState<Date>();
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Đã sao chép mã hồ sơ!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không thể sao chép. Vui lòng thử lại.");
    }
  };

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedProcedureId) {
        toast.error("Vui lòng chọn thủ tục trước khi nộp hồ sơ.");
        return;
      }

      const formElement = event.currentTarget;
      const formData = new FormData(formElement);

      const fullName = String(formData.get("fullName") || "").trim();
      const birthDate = date ? format(date, "yyyy-MM-dd") : "";
      const cccd = String(formData.get("cccd") || "").trim();
      const address = String(formData.get("address") || "").trim();
      const attachments = formData.getAll("attachments");
      const firstAttachment = attachments.find(
        (file) => file instanceof File && file.size > 0,
      );

      if (!fullName || !cccd || !address) {
        toast.error("Vui lòng nhập đầy đủ họ tên, CCCD/CMND và địa chỉ.");
        return;
      }

      if (!date) {
        toast.error("Vui lòng chọn ngày tháng năm sinh.");
        return;
      }

      if (!(firstAttachment instanceof File)) {
        toast.error("Vui lòng đính kèm file hồ sơ.");
        return;
      }

      formData.set("serviceId", String(selectedProcedureId));

      formData.set("ServiceId", String(selectedProcedureId));
      formData.set("ApplicantName", fullName);
      formData.set("IdentityNumber", cccd);
      formData.set("Address", address);
      if (birthDate) {
        formData.set("DateOfBirth", birthDate);
      }
      formData.set("AttachedFile", firstAttachment);

      setIsSubmitting(true);
      try {
        const result = await submitPublicApplication(formData);
        setSubmittedCode(result.applicationCode || "");
        setCopied(false);
        setIsSubmitted(true);
        toast.success(
          result.applicationCode
            ? `Nộp hồ sơ thành công! Mã hồ sơ: ${result.applicationCode}`
            : "Nộp hồ sơ thành công!",
        );
        formElement.reset();
        setDate(undefined);
        // Scroll success panel into view
        setTimeout(() => {
          successPanelRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Nộp hồ sơ thất bại. Vui lòng thử lại sau.";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [date, selectedProcedureId],
  );

  return (
    <div className="space-y-5">
      {isSubmitted && (
        <div
          ref={successPanelRef}
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 scroll-m-4"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 mb-3">
            <CheckCircle2 className="size-5" />
            Nộp hồ sơ thành công!
          </div>
          {submittedCode?.trim() ? (
            <>
              <p className="text-xs text-emerald-800 mb-3">
                <strong>Mã hồ sơ của bạn:</strong> Vui lòng lưu lại để tra cứu
                tình trạng xử lý sau này.
              </p>
              <div className="flex items-center gap-2 rounded-md bg-white p-4 border-2 border-emerald-300 mb-3">
                <code className="flex-1 text-base font-mono font-bold text-emerald-900 tracking-widest">
                  {submittedCode}
                </code>
                <Button
                  type="button"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                  onClick={() => handleCopyCode(submittedCode)}
                  aria-label="Sao chép mã hồ sơ"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Sao chép
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-emerald-700">
                Nhấn nút Sao chép để lưu mã hồ sơ, hoặc bạn có thể{" "}
                <Link href="/dich-vu/tra-cuu-ho-so">
                  <Button
                    variant="link"
                    className="font-semibold text-xs text-emerald-700 p-0"
                  >
                    tra cứu trạng thái
                  </Button>
                </Link>
              </p>
            </>
          ) : (
            <p className="text-xs text-emerald-800 mb-3">
              ✓ Hồ sơ của bạn đã được tiếp nhận. Vui lòng liên hệ với cơ quan để
              biết thêm chi tiết hoặc theo dõi tình trạng xử lý.
            </p>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="mt-4 text-emerald-700 hover:bg-emerald-100"
            onClick={() => {
              setIsSubmitted(false);
              setSubmittedCode("");
              setCopied(false);
            }}
          >
            ← Nộp hồ sơ khác
          </Button>
        </div>
      )}

      <form className="space-y-5 pb-3" onSubmit={handleSubmit}>
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Trường có dấu * là bắt buộc. Vui lòng đính kèm đúng tệp hồ sơ để hệ
          thống tiếp nhận.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-medium text-slate-700">
              Họ và tên *
            </Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="font-medium text-slate-700">
              Ngày tháng năm sinh *
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birthDate"
                  type="button"
                  variant="outline"
                  data-empty={!date}
                  className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Chọn ngày, tháng, năm sinh</span>
                  )}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  captionLayout="dropdown"
                  defaultMonth={date}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cccd" className="font-medium text-slate-700">
              CCCD/CMND *
            </Label>
            <Input id="cccd" name="cccd" placeholder="012345678901" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="font-medium text-slate-700">
              Địa chỉ *
            </Label>
            <Input
              id="address"
              name="address"
              placeholder="Số nhà, đường, phường..."
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachments" className="font-medium text-slate-700">
            Tệp hồ sơ đính kèm *
          </Label>
          <Input id="attachments" name="attachments" type="file" required />
          <p className="text-xs text-muted-foreground">
            Chỉ cần chọn 1 file theo đúng yêu cầu của thủ tục.
          </p>
        </div>

        <Button
          type="submit"
          disabled={!selectedProcedureId || isSubmitting}
          className="w-full bg-[#0f5fc6] text-white hover:bg-[#0c4ea2] md:w-auto"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Send className="mr-2 size-4" />
          )}
          Nộp hồ sơ
        </Button>
      </form>
    </div>
  );
}

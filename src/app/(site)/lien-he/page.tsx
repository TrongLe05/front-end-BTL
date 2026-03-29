import MapCard from "@/components/ui/Card/CardMap/cardmap";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export default function LienHe() {
  return (
    <div>
      <div className="text-center my-6">
        <h1 className="text-3xl font-bold">Liên hệ</h1>
        <div className="mx-auto mt-10 grid max-w-6xl items-stretch gap-6 px-4 md:grid-cols-2 md:px-0">
          <div className="flex h-full flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Thông tin UBND
                </CardTitle>
              </CardHeader>

              <CardContent className="text-left text-base space-y-2">
                <p>
                  Địa chỉ: Số 03, đường 30/4, phường Cao Lãnh, tỉnh Đồng Tháp.
                </p>

                <p>
                  Số điện thoại:{" "}
                  <a
                    href="tel:02773851601"
                    className="text-blue-600 hover:underline"
                  >
                    02773851601
                  </a>
                </p>

                <p>
                  Email:{" "}
                  <a
                    href="mailto:ubndpcaolanh@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    ubndpcaolanh@gmail.com
                  </a>
                </p>

                <p>
                  Website:{" "}
                  <a
                    href="https://caolanh.dongthap.gov.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    caolanh.dongthap.gov.vn
                  </a>
                </p>
              </CardContent>
            </Card>

            <MapCard />
          </div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Phản ánh / kiến nghị
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid">
                    <Label htmlFor="hoTen" className="text-base">
                      Họ & tên
                    </Label>
                    <Input
                      id="hoTen"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="py-5"
                    />
                  </div>
                  <div className="grid ">
                    <Label htmlFor="email" className="text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mail@example.com"
                      className="py-5"
                    />
                  </div>
                  <div className="grid">
                    <div className="flex items-center">
                      <Label htmlFor="numberPhone" className="text-base">
                        Số điện thoại
                      </Label>
                    </div>
                    <Input
                      id="numberPhone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="py-5"
                    />
                  </div>
                  <div className="grid ">
                    <Label htmlFor="message" className="text-base">
                      Nội dung phản ánh/kiến nghị
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Nhập nội dung phản ánh/kiến nghị"
                      className="h-40"
                    />
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter>
              <Button size="lg" className="w-full text-base ">
                GỬI
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

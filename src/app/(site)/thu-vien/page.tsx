"use client";

import { useEffect, useMemo, useState } from "react";

type GalleryApiItem = {
  imageId?: number;
  id?: number;
  title?: string;
  section?: string;
  fileUrl?: string;
  imageUrl?: string;
  url?: string;
  path?: string;
  isVisible?: boolean;
  uploaderId?: number;
  uploaderName?: string;
  createdAt?: string;
};

type GalleryItem = {
  id: number;
  title: string;
  section: string;
  imageUrl: string;
  blobUrl?: string;
  createdAt?: string;
};

function normalizeGalleryResponse(payload: unknown): GalleryApiItem[] {
  // Backend có thể trả về mảng trực tiếp hoặc bọc trong wrapper object
  if (Array.isArray(payload)) {
    return payload as GalleryApiItem[];
  }

  if (payload && typeof payload === "object") {
    const asRecord = payload as Record<string, unknown>;
    // Ưu tiên order: value > data > items > result
    const possibleList =
      asRecord.value ?? asRecord.data ?? asRecord.items ?? asRecord.result;

    if (Array.isArray(possibleList)) {
      return possibleList as GalleryApiItem[];
    }
  }

  return [];
}

function mapGalleryItem(
  item: GalleryApiItem,
  index: number,
): GalleryItem | null {
  // Chuẩn hóa ID: ưu tiên imageId từ backend
  const itemId = item.imageId ?? item.id ?? index + 1;

  // FE không tự ghép đường dẫn, dùng trực tiếp ImageUrl backend trả về
  // Ưu tiên sử dụng endpoint ổn định (vd: /api/Gallery/{id}/image) nếu có
  const imageUrl = item.imageUrl ?? item.fileUrl ?? item.url ?? item.path ?? "";

  if (!imageUrl) {
    return null;
  }

  return {
    id: itemId,
    title: item.title?.trim() || `Hinh anh #${index + 1}`,
    section: item.section?.trim() || "Thu vien",
    imageUrl,
    createdAt: item.createdAt,
  };
}

export default function ThuVienPage() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5265";

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchGallery = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiBaseUrl}/api/Gallery`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Khong the tai danh sach anh (HTTP ${response.status}).`,
          );
        }

        const payload = (await response.json().catch(() => null)) as unknown;
        const normalized = normalizeGalleryResponse(payload)
          .map((item, idx) => mapGalleryItem(item, idx))
          .filter((item): item is GalleryItem => Boolean(item));

        if (isMounted) {
          setGallery(normalized);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Khong the tai danh sach anh luc nay.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchGallery();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="rounded-2xl border bg-linear-to-r from-sky-50 via-white to-cyan-50 p-6 md:p-8 mb-10">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Thư viện
        </h1>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Đang tải dữ liệu thư viện...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && gallery.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Chưa có ảnh nào trong thư viện.
        </div>
      ) : null}

      {!isLoading && !error && gallery.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
              >
                <div
                  className="relative h-56 w-full bg-muted overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedImage(item.imageUrl)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback hiển thị ảnh mặc định khi bị 404 để không vỡ UI
                      e.currentTarget.src = "/empty.jpg";
                      e.currentTarget.onerror = null; // Tránh lặp vô hạn nếu ảnh fallback cũng lỗi
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium">
                      Bấm để xem ảnh lớn
                    </span>
                  </div>
                </div>
                <div className="space-y-1 p-4">
                  <h2 className="line-clamp-1 text-base font-semibold">
                    {item.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Phân loại: {item.section}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {/* Modal hiển thị ảnh lớn */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-screen max-w-full w-[90vw] h-[90vh]">
            <img
              src={selectedImage}
              alt="Ảnh phóng to"
              className="w-full h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

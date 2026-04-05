import { ArticleRequest, Category } from "@/types";

const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5265";

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");
const API_PREFIX = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

function toRelativeAssetPath(urlOrPath?: string): string {
  if (!urlOrPath) {
    return "";
  }

  if (/^https?:\/\//i.test(urlOrPath)) {
    try {
      return new URL(urlOrPath).pathname;
    } catch {
      return urlOrPath;
    }
  }

  return urlOrPath;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_PREFIX}/admin/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getArticles() {
  try {
    const response = await fetch(`${API_PREFIX}/Article`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticleById(id: number) {
  try {
    const response = await fetch(`${API_PREFIX}/Article/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function createArticle(article: ArticleRequest) {
  try {
    const response = await fetch(`${API_PREFIX}/Article`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to create article: ${response.statusText}`,
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
}

export async function updateArticle(id: number, article: ArticleRequest) {
  try {
    const response = await fetch(`${API_PREFIX}/Article/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to update article: ${response.statusText}`,
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

export async function deleteArticle(id: number) {
  try {
    const response = await fetch(`${API_PREFIX}/Article/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to delete article: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

export async function uploadArticleThumbnail(
  file: File,
  uploaderId: number,
  title?: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("section", "article-thumbnail");
  formData.append("uploaderId", String(uploaderId));
  if (title?.trim()) {
    formData.append("title", title.trim());
  }

  const response = await fetch(`${API_PREFIX}/Gallery/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Failed to upload thumbnail: ${response.statusText}`,
    );
  }

  const thumbnailUrl =
    data?.Image?.RelativeUrl ||
    data?.image?.relativeUrl ||
    data?.Image?.StaticUrl ||
    data?.Image?.ImageUrl ||
    data?.image?.staticUrl ||
    data?.image?.imageUrl;

  if (!thumbnailUrl) {
    throw new Error("Upload thành công nhưng không nhận được URL ảnh.");
  }

  const relativeThumbnailUrl = toRelativeAssetPath(thumbnailUrl as string);

  if (!relativeThumbnailUrl) {
    throw new Error("Upload thành công nhưng URL ảnh không hợp lệ.");
  }

  return relativeThumbnailUrl;
}

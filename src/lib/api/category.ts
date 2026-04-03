export type ApiCategory = {
  categoryId: number;
  parentId?: number | null;
  name: string;
  slug: string;
  status?: number | null;
  parentName?: string | null;
  parentSlug?: string | null;
};

export type CreateCategoryRequest = {
  name: string;
  parentId?: number | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCategories(
  signal?: AbortSignal,
): Promise<ApiCategory[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }

  const data = (await response.json()) as ApiCategory[];
  return data;
}

export async function createCategory(
  request: CreateCategoryRequest,
  signal?: AbortSignal,
): Promise<ApiCategory> {
  const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to create category: ${response.status}`);
  }

  return (await response.json()) as ApiCategory;
}

export async function hideCategory(
  categoryId: number,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/categories/${categoryId}/hide`,
    {
      method: "PUT",
      headers: { Accept: "application/json" },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to hide category: ${response.status}`);
  }
}

export async function showCategory(
  categoryId: number,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/categories/${categoryId}/show`,
    {
      method: "PUT",
      headers: { Accept: "application/json" },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to show category: ${response.status}`);
  }
}

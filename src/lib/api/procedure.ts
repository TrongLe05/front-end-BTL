import { API_PREFIX } from "@/lib/api/config";

export type ProcedureField = {
  serviceCategoryId: number;
  categoryCode: string;
  fieldName: string;
  description: string | null;
  procedureCount: number;
  createdAt: string | null;
};

export type ProcedureByField = {
  serviceId: number;
  serviceCategoryId: number;
  categoryName: string | null;
  serviceCode: string;
  procedureName: string;
  description: string | null;
  procedureFileUrl: string | null;
  templateFileUrl: string | null;
  createdAt: string | null;
};

export async function getProcedureFields(): Promise<ProcedureField[]> {
  const endpoint = `${API_PREFIX}/public/applications/fields`;

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Không thể tải danh sách lĩnh vực: ${response.status}`);
  }

  const data = (await response.json()) as Array<{
    serviceCategoryId?: number;
    categoryCode?: string;
    fieldName?: string;
    description?: string | null;
    procedureCount?: number;
    createdAt?: string | null;
  }>;

  return data
    .filter(
      (item) =>
        Number.isFinite(item.serviceCategoryId) &&
        typeof item.fieldName === "string" &&
        item.fieldName.trim().length > 0,
    )
    .map((item) => ({
      serviceCategoryId: item.serviceCategoryId as number,
      categoryCode: item.categoryCode ?? "",
      fieldName: item.fieldName as string,
      description: item.description ?? null,
      procedureCount: item.procedureCount ?? 0,
      createdAt: item.createdAt ?? null,
    }));
}

export async function getProceduresByField(
  fieldId: number,
): Promise<ProcedureByField[]> {
  const endpoint = `${API_PREFIX}/public/applications/fields/${fieldId}/procedures`;

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Không thể tải danh sách thủ tục: ${response.status}`);
  }

  const data = (await response.json()) as Array<{
    serviceId?: number;
    serviceCategoryId?: number;
    categoryName?: string | null;
    serviceCode?: string;
    procedureName?: string;
    description?: string | null;
    procedureFileUrl?: string | null;
    templateFileUrl?: string | null;
    createdAt?: string | null;
  }>;

  return data
    .filter(
      (item) =>
        Number.isFinite(item.serviceId) &&
        Number.isFinite(item.serviceCategoryId) &&
        typeof item.procedureName === "string" &&
        item.procedureName.trim().length > 0,
    )
    .map((item) => ({
      serviceId: item.serviceId as number,
      serviceCategoryId: item.serviceCategoryId as number,
      categoryName: item.categoryName ?? null,
      serviceCode: item.serviceCode ?? "",
      procedureName: item.procedureName as string,
      description: item.description ?? null,
      procedureFileUrl: item.procedureFileUrl ?? null,
      templateFileUrl: item.templateFileUrl ?? null,
      createdAt: item.createdAt ?? null,
    }));
}

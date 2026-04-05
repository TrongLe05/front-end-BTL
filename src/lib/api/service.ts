export type Service = {
  serviceId: number;
  name: string;
  description: string;
  procedureDetails?: string;
  isActive: boolean;
};

const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5265";

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");
const API_PREFIX = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

export async function getActiveServices(
  signal?: AbortSignal,
): Promise<Service[]> {
  const endpoints = [`${API_PREFIX}/Services`, `${API_PREFIX}/Service`];

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal,
    });

    if (response.ok) {
      const data: Service[] = await response.json();
      return data.filter((service) => service.isActive);
    }

    if (response.status !== 404) {
      throw new Error(`Failed to load services: ${response.status}`);
    }
  }

  return [];
}

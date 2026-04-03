export type Service = {
  serviceId: number;
  name: string;
  description: string;
  procedureDetails?: string;
  isActive: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5265";

export async function getActiveServices(
  signal?: AbortSignal,
): Promise<Service[]> {
  const response = await fetch(`${API_BASE_URL}/api/Service`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to load services: ${response.status}`);
  }

  const data: Service[] = await response.json();
  return data.filter((service) => service.isActive);
}

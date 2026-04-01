"use server";

import { revalidatePath } from "next/cache";

export async function revalidateArticles() {
  revalidatePath("/admin/articles");
}

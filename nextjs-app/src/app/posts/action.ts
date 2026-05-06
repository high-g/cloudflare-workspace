"use server";

import { postJson } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await postJson(`/posts`, { title, content });
  revalidatePath("/posts");
}

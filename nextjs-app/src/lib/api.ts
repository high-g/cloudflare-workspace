export async function postJson(path: string, body: unknown) {
  return await fetch(`${process.env.HONO_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

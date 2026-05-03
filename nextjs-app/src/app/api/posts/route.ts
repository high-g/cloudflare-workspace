export async function GET() {
  const res = await fetch(`${process.env.HONO_API_URL}/posts`);
  const data = await res.json();
  return Response.json(data);
}

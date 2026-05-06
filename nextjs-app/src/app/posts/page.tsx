export default async function Posts() {
  const res = await fetch(`${process.env.HONO_API_URL}/posts`);
  const posts = await res.json();

  return (
    <main>
      <h1 className="font-bold text-4xl">Posts</h1>
      <ul>
        {posts.map((post: { id: number; title: string; content: string }) => (
          <li key={post.id} className="flex gap-4">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

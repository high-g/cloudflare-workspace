import { createPost } from "./action";

export default async function Posts() {
  const res = await fetch(`${process.env.HONO_API_URL}/posts`);
  const posts = await res.json();

  return (
    <main>
      <h1 className="font-bold text-4xl">Posts</h1>

      <form action={createPost}>
        <input name="title" placeholder="title" required className="border" />
        <input name="content" placeholder="content" required className="border" />
        <button type="submit" className="border">
          投稿
        </button>
      </form>

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

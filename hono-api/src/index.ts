import { Hono } from "hono";
import { createDb } from "./db";
import { posts } from "./db/schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.json({ message: "Hello from Workers!" }));

app.get("/posts", async (c) => {
  const db = createDb(c.env.DB);
  const all = await db.select().from(posts);
  return c.json(all);
});

app.post("/posts", async (c) => {
  const { title, content } = await c.req.json();
  const db = createDb(c.env.DB);
  const result = await db.insert(posts).values({ title, content }).returning();
  return c.json(result[0], 201);
});

export default app;

import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, TodoEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { Todo } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // DEMO ROUTES (can be removed)
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env, c.req.query('cursor') ?? null, c.req.query('limit') ? Math.max(1, (Number(c.req.query('limit')) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const page = await ChatBoardEntity.list(c.env, c.req.query('cursor') ?? null, c.req.query('limit') ? Math.max(1, (Number(c.req.query('limit')) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // CLARITY TODO ROUTES
  app.get('/api/todos', async (c) => {
    const { items } = await TodoEntity.list(c.env);
    return ok(c, items);
  });
  app.post('/api/todos', async (c) => {
    const { text } = (await c.req.json()) as { text?: string };
    if (!text?.trim()) return bad(c, 'text is required');
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    await TodoEntity.create(c.env, newTodo);
    return ok(c, newTodo);
  });
  app.post('/api/todos/bulk-delete', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
        return bad(c, 'An array of "ids" is required');
    }
    const deletedCount = await TodoEntity.deleteMany(c.env, ids);
    return ok(c, { deletedCount });
  });
  app.patch('/api/todos/:id', async (c) => {
    const id = c.req.param('id');
    const todoEntity = new TodoEntity(c.env, id);
    if (!(await todoEntity.exists())) return notFound(c, 'Todo not found');
    const patch = (await c.req.json()) as Partial<Pick<Todo, 'text' | 'completed'>>;
    if (typeof patch.text === 'undefined' && typeof patch.completed === 'undefined') {
      return bad(c, 'text or completed field is required for update');
    }
    const updatedTodo = await todoEntity.mutate(current => ({ ...current, ...patch }));
    return ok(c, updatedTodo);
  });
  app.delete('/api/todos/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await TodoEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Todo not found');
    return ok(c, { id, deleted: true });
  });
}
import { nanoid } from "@reduxjs/toolkit";
import { rest } from "msw";

import { CreatePostBody, PostError } from "../app/services/posts";
import { db } from "./db";

export const handlers = [
  rest.get("/api/posts", (req, res, ctx) => {
    const page = (req.url.searchParams.get("page") || 1) as number;
    const per_page = (req.url.searchParams.get("per_page") || 10) as number;
    const data = db.post.findMany({
      take: per_page,
      skip: Math.max(per_page * (page - 1), 0),
      // orderBy: {
      //   // id: "desc",
      //   // created_at: "desc",
      // },
    });

    return res(
      ctx.json({
        data,
        page,
        total_pages: Math.ceil(db.post.count() / per_page),
        total: db.post.count(),
      })
    );
  }),
  rest.get<{}, { id: string }>("/api/posts/:id", (req, res, ctx) => {
    const id = req.params.id;
    const post = db.post.findFirst({ where: { id: { equals: id } } });

    if (!post) {
      return res(ctx.status(400), ctx.json({ message: "Post not fond" }));
    }

    return res(ctx.json(post));
  }),
  rest.post<CreatePostBody>("/api/posts", (req, res, ctx) => {
    const { title, author, content, status } = req.body;
    const errors = isInvalid(req.body);

    if (Object.keys(errors).length > 0) {
      return res(ctx.status(400), ctx.json(errors));
    }

    const post = db.post.create({
      id: nanoid(),
      title,
      author,
      content,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return res(ctx.status(201), ctx.json(post));
  }),
  rest.put<Partial<CreatePostBody>, { id: string }>(
    "/api/posts/:id",
    (req, res, ctx) => {
      const id = req.params.id;
      const body = req.body;
      const errors = isInvalid(req.body);

      if (Object.keys(errors).length > 0) {
        return res(ctx.status(400), ctx.json(errors));
      }

      const postExist = db.post.findFirst({ where: { id: { equals: id } } });
      if (!postExist) {
        return res(ctx.status(400), ctx.json({ message: "Post not fond" }));
      }

      const post = db.post.update({
        where: { id: { equals: id } },
        data: body,
      });

      return res(ctx.json({ ...post }));
    }
  ),
  rest.delete<{}, { id: string }>("/api/posts/:id", (req, res, ctx) => {
    const id = req.params.id;
    const post = db.post.findFirst({ where: { id: { equals: id } } });

    if (!post) {
      return res(ctx.status(400), ctx.json({ message: "Post not fond" }));
    }

    db.post.delete({ where: { id: { equals: id } } });

    return res(ctx.json(post));
  }),
];

const isInvalid = (body: CreatePostBody | Partial<CreatePostBody>) => {
  const { title, author, content, status } = body;
  const errors: PostError = {};

  if (!title?.trim()) {
    errors.title = "Title is required";
  }
  if (!author?.trim()) {
    errors.author = "Author is required";
  }
  if (!content?.trim()) {
    errors.content = "Content is required";
  }
  if (!status?.trim()) {
    errors.status = "Status is required";
  }

  return errors;
};

import { nanoid } from "@reduxjs/toolkit";
import { rest } from "msw";

import {
  CreatePostBody,
  CreateUserBody,
  PostError,
} from "../app/services/posts";
import { db } from "./db";

export const handlers = [
  rest.get("/api/posts", (req, res, ctx) => {
    const page = (req.url.searchParams.get("page") || 1) as number;
    const per_page = (req.url.searchParams.get("per_page") || 10) as number;
    const data = db.post.findMany({
      take: per_page,
      skip: Math.max(per_page * (page - 1), 0),
      orderBy: {
        created_at: "desc",
      },
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
    const errors = isPostInvalid(req.body);

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
      const errors = isPostInvalid(req.body);

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
  // User
  rest.get("/api/users", (req, res, ctx) => {
    const page = (req.url.searchParams.get("page") || 1) as number;
    const per_page = (req.url.searchParams.get("per_page") || 10) as number;
    const data = db.user.findMany({
      take: per_page,
      skip: Math.max(per_page * (page - 1), 0),
      orderBy: {
        created_at: "desc",
      },
    });

    return res(
      ctx.json({
        data,
        page,
        total_pages: Math.ceil(db.user.count() / per_page),
        total: db.user.count(),
      })
    );
  }),
  rest.get<{}, { id: string }>("/api/users/:id", (req, res, ctx) => {
    const id = req.params.id;
    const user = db.user.findFirst({ where: { id: { equals: id } } });

    if (!user) {
      return res(ctx.status(400), ctx.json({ message: "Post not found" }));
    }

    return res(ctx.json(user));
  }),
  rest.post<CreateUserBody>("/api/users", (req, res, ctx) => {
    const errors = isUserInvalid(req.body);

    if (Object.keys(errors).length > 0) {
      return res(ctx.status(400), ctx.json(errors));
    }

    const user = db.user.create({
      ...req.body,
      id: nanoid(),
      status: +req.body.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return res(ctx.status(201), ctx.json(user));
  }),
  rest.put<Partial<CreateUserBody>, { id: string }>(
    "/api/users/:id",
    (req, res, ctx) => {
      const id = req.params.id;
      const body = req.body;
      const errors = isUserInvalid(req.body);

      if (Object.keys(errors).length > 0) {
        return res(ctx.status(400), ctx.json(errors));
      }

      const userExist = db.user.findFirst({ where: { id: { equals: id } } });
      if (!userExist) {
        return res(ctx.status(400), ctx.json({ message: "Post not found" }));
      }

      const user = db.user.update({
        where: { id: { equals: id } },
        data: {
          ...body,
          status: body.status ? +body.status : userExist.status,
        },
      });

      return res(ctx.json({ ...user }));
    }
  ),
  rest.delete<{}, { id: string }>("/api/users/:id", (req, res, ctx) => {
    const id = req.params.id;
    const user = db.user.findFirst({ where: { id: { equals: id } } });

    if (!user) {
      return res(ctx.status(400), ctx.json({ message: "Post not found" }));
    }

    db.user.delete({ where: { id: { equals: id } } });

    return res(ctx.json(user));
  }),
];

const isPostInvalid = (body: Partial<CreatePostBody>) => {
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

const isUserInvalid = (body: Partial<CreateUserBody>) => {
  const { firstName, lastName, username, password, email, status } = body;
  const errors: Partial<CreateUserBody> = {};

  if (!firstName?.trim()) {
    errors.firstName = "First Name is required";
  }
  if (!lastName?.trim()) {
    errors.lastName = "Last Name is required";
  }
  if (!username?.trim()) {
    errors.username = "Username is required";
  }
  if (!status?.trim()) {
    errors.status = "Status is required";
  }
  if (!password?.trim()) {
    errors.password = "Password is required";
  }
  if (!status?.trim()) {
    errors.email = "Email is required";
  }

  return errors;
};

import { factory, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import faker from "faker";

import { Post, postStatuses, User } from "../app/services/posts";

export const db = factory({
  post: {
    id: primaryKey(String),
    title: String,
    author: String,
    content: String,
    status: String,
    created_at: String,
    updated_at: String,
  },
  user: {
    id: primaryKey(String),
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    avatar: String,
    status: Number,
    created_at: String,
    updated_at: String,
  },
});

const getRandomStatus = () =>
  postStatuses[Math.floor(Math.random() * postStatuses.length)];

const createPostData = (): Post => {
  const date = faker.date.past().toISOString();
  return {
    id: nanoid(8),
    title: faker.lorem.words(),
    author: faker.name.findName(),
    content: faker.lorem.paragraphs(),
    status: getRandomStatus(),
    created_at: date,
    updated_at: date,
  };
};

const createUserData = (): User => {
  const date = faker.date.past().toISOString();
  return {
    id: nanoid(8),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.name.findName(),
    password: faker.internet.password().toLowerCase(),
    email: faker.internet.email(),
    avatar: faker.internet.avatar(),
    status: Math.random() < 0.5 ? 0 : 1,
    created_at: date,
    updated_at: date,
  };
};

[...new Array(50)].forEach((_) => {
  db.post.create(createPostData());
  db.user.create(createUserData());
});
// console.log(JSON.stringify(db.post.findMany({})));

import { factory, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import faker from "faker";

import { Post, postStatuses } from "../app/services/posts";

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
});

const getRandomStatus = () =>
  postStatuses[Math.floor(Math.random() * postStatuses.length)];

const createPostData = (id: string): Post => {
  const date = faker.date.past().toISOString();
  return {
    // id: nanoid(),
    id,
    title: faker.lorem.words(),
    author: faker.name.findName(),
    content: faker.lorem.paragraphs(),
    status: getRandomStatus(),
    created_at: date,
    updated_at: date,
  };
};

[...new Array(50)].forEach((_, index) =>
  db.post.create(createPostData(index.toString()))
);
// console.log(JSON.stringify(db.post.findMany({})));

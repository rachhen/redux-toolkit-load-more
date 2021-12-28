import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cacher } from "../../utils/rtkQueryCacheUtils";
import { RootState } from "../store";
import { ListRessonse, getCache } from "../../utils/cache";

export const postStatuses = ["draft", "published", "pending_review"] as const;

export interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  status: typeof postStatuses[number];
  created_at: string;
  updated_at: string;
}

export interface CreatePostBody {
  title: string;
  author: string;
  content: string;
  status: typeof postStatuses[number];
}

export interface UpdatePostBody extends Partial<CreatePostBody> {
  id: string;
}

export type PostError = {
  title?: string;
  author?: string;
  content?: string;
  status?: string;
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  avatar: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserBody {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  avatar: string;
  status: string;
}

export const postApi = createApi({
  reducerPath: "posts",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: [...cacher.defaultTags, "Post", "User"],
  endpoints: (builder) => ({
    posts: builder.query<ListRessonse<Post>, number | void>({
      query: (page = 1) => `posts?page=${page}`,
      providesTags: cacher.providesNestedList("Post"),
      async onQueryStarted(_, { getState, queryFulfilled, updateCachedData }) {
        try {
          const state = getState() as RootState;
          const cacheData = getCache<Post>(state, "posts", "posts", "id");
          const { data } = await queryFulfilled;
          cacheData.push(...data.data);
          const newData = { ...data, data: cacheData };
          updateCachedData((draft) => {
            Object.assign(draft, newData);
          });
        } catch (err) {
          console.log(err);
          console.log("Error fetching posts!");
        }
      },
    }),
    post: builder.query<Post, string>({
      query: (id) => `posts/${id}`,
      providesTags: cacher.cacheByIdArg("Post"),
    }),
    addPost: builder.mutation<Post, CreatePostBody>({
      query: (body) => ({ url: "posts", method: "POST", body }),
      invalidatesTags: cacher.invalidatesList("Post"),
    }),
    updatePost: builder.mutation<Post, UpdatePostBody>({
      query: ({ id, ...body }) => ({ url: `posts/${id}`, method: "PUT", body }),
      invalidatesTags: cacher.cacheByIdArgProperty("Post"),
    }),
    deletePost: builder.mutation<Post, string>({
      query: (id) => ({ url: `posts/${id}`, method: "DELETE" }),
      invalidatesTags: cacher.cacheByIdArg("Post"),
    }),
    users: builder.query<ListRessonse<User>, number | void>({
      query: (page = 1) => `users?page=${page}`,
      providesTags: cacher.providesNestedList("User"),
      async onQueryStarted(_, { getState, queryFulfilled, updateCachedData }) {
        try {
          const state = getState() as RootState;
          const cacheData = getCache<User>(state, "posts", "users", "id");
          const { data } = await queryFulfilled;
          cacheData.push(...data.data);
          const newData = { ...data, data: cacheData };
          updateCachedData((draft) => {
            Object.assign(draft, newData);
          });
        } catch (err) {
          console.log(err);
          console.log("Error fetching posts!");
        }
      },
    }),
    user: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: cacher.cacheByIdArg("User"),
    }),
    addUser: builder.mutation<User, CreateUserBody>({
      query: (body) => ({ url: "users", method: "POST", body }),
      invalidatesTags: cacher.invalidatesList("User"),
    }),
    updateUser: builder.mutation<
      User,
      Partial<CreateUserBody> & { id: string }
    >({
      query: ({ id, ...body }) => ({ url: `users/${id}`, method: "PUT", body }),
      invalidatesTags: cacher.cacheByIdArgProperty("User"),
    }),
    deleteUser: builder.mutation<User, string>({
      query: (id) => ({ url: `users/${id}`, method: "DELETE" }),
      invalidatesTags: cacher.cacheByIdArg("User"),
    }),
  }),
});

export const {
  usePostsQuery,
  usePostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useUsersQuery,
  useUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = postApi;

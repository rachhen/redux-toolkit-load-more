import _ from "lodash";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cacher } from "../../utils/rtkQueryCacheUtils";
import { RootState } from "../store";

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

interface ListRessonse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
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

function unionBy<T extends unknown[]>(arr1: T, arr2: T, prop: keyof T[number]) {
  return [...arr2, ...arr1].filter((item, pos, arr) => {
    return arr.findIndex((item2) => item[prop] == item2[prop]) == pos;
  });
}

export const postApi = createApi({
  reducerPath: "posts",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: [...cacher.defaultTags, "Post"],
  endpoints: (builder) => ({
    login: builder.mutation<unknown, void>({
      query: () => "/login",
      invalidatesTags: cacher.invalidatesUnauthorized(),
    }),
    refetchErroredQueries: builder.mutation<unknown, void>({
      queryFn: () => {
        return { data: {} };
      },
      invalidatesTags: cacher.invalidatesUnknownErrors(),
    }),
    posts: builder.query<ListRessonse<Post>, number | void>({
      query: (page = 1) => `posts?page=${page}`,
      providesTags: cacher.providesNestedList("Post"),
      async onQueryStarted(_, { getState, queryFulfilled, updateCachedData }) {
        try {
          const state = getState() as RootState;
          const postsQueries = state.posts.queries;
          let cacheData: Post[] = [];

          for (let post of Object.values(postsQueries)) {
            if (post?.status === "fulfilled") {
              const postData = post.data as ListRessonse<Post>;
              cacheData = unionBy<Post[]>(cacheData, postData.data, "id");
            }
          }

          const { data } = await queryFulfilled;
          cacheData.push(...data.data);
          // cacheData.sort((a, b) => +a.id - +b.id);
          const newData = { ...data };
          newData.data = cacheData;
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
  }),
});

export const {
  usePostsQuery,
  usePostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApi;

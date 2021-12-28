import { RootState } from "../app/store";

export interface ListRessonse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}

/**
 * Get old cache merge and unique by property
 * @param state The root state
 * @param reducerPath The reducer path you want to get cache
 * @param endpointName Endpoint path you was defined
 * @param prop Key you want to to search for unique
 *
 * @example
 * ```ts
 * export const postApi = createApi({
 *  reducerPath: "posts",
 *  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
 *  tagTypes: [...cacher.defaultTags, "Post", "User"],
 *  endpoints: (builder) => ({
 *    posts: builder.query<ListRessonse<Posts>, number | void>({
 *      query: (page = 1) => `posts?page=${page}`,
 *      providesTags: cacher.providesNestedList("Post"),
 *      async onQueryStarted(_, { getState, queryFulfilled, updateCachedData }) {
 *        try {
 *          const state = getState() as RootState;
 *          const cacheData = getCache<Post>(state, "posts", "posts", "id");
 *          const { data } = await queryFulfilled;
 *          cacheData.push(...data.data);
 *          const newData = { ...data, data: cacheData };
 *          updateCachedData((draft) => {
 *            Object.assign(draft, newData);
 *          });
 *        } catch (err) {
 *          console.log(err);
 *          console.log("Error fetching posts!");
 *        }
 *      },
 *    }),
 *  }),
 * });
 * ```
 */
export const getCache = <T>(
  state: RootState,
  reducerPath: keyof RootState,
  endpointName: string,
  prop: keyof T
) => {
  const queries = state[reducerPath].queries;
  let cacheData: T[] = [];
  for (let post of Object.values(queries)) {
    if (post?.status === "fulfilled" && post.endpointName === endpointName) {
      const postData = post.data as ListRessonse<T>;
      cacheData = unionBy<T[]>(cacheData, postData.data, prop);
    }
  }
  return cacheData;
};

function unionBy<T extends unknown[]>(arr1: T, arr2: T, prop: keyof T[number]) {
  return [...arr2, ...arr1].filter((item, pos, arr) => {
    return arr.findIndex((item2) => item[prop] == item2[prop]) == pos;
  });
}
